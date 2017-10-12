package zvonimir.tomesic.web.rest;

import zvonimir.tomesic.AManagerApp;

import zvonimir.tomesic.domain.Set;
import zvonimir.tomesic.repository.SetRepository;
import zvonimir.tomesic.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the SetResource REST controller.
 *
 * @see SetResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AManagerApp.class)
public class SetResourceIntTest {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    @Autowired
    private SetRepository setRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restSetMockMvc;

    private Set set;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SetResource setResource = new SetResource(setRepository);
        this.restSetMockMvc = MockMvcBuilders.standaloneSetup(setResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Set createEntity(EntityManager em) {
        Set set = new Set()
            .title(DEFAULT_TITLE)
            .content(DEFAULT_CONTENT);
        return set;
    }

    @Before
    public void initTest() {
        set = createEntity(em);
    }

    @Test
    @Transactional
    public void createSet() throws Exception {
        int databaseSizeBeforeCreate = setRepository.findAll().size();

        // Create the Set
        restSetMockMvc.perform(post("/api/sets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(set)))
            .andExpect(status().isCreated());

        // Validate the Set in the database
        List<Set> setList = setRepository.findAll();
        assertThat(setList).hasSize(databaseSizeBeforeCreate + 1);
        Set testSet = setList.get(setList.size() - 1);
        assertThat(testSet.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testSet.getContent()).isEqualTo(DEFAULT_CONTENT);
    }

    @Test
    @Transactional
    public void createSetWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = setRepository.findAll().size();

        // Create the Set with an existing ID
        set.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSetMockMvc.perform(post("/api/sets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(set)))
            .andExpect(status().isBadRequest());

        // Validate the Set in the database
        List<Set> setList = setRepository.findAll();
        assertThat(setList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = setRepository.findAll().size();
        // set the field null
        set.setTitle(null);

        // Create the Set, which fails.

        restSetMockMvc.perform(post("/api/sets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(set)))
            .andExpect(status().isBadRequest());

        List<Set> setList = setRepository.findAll();
        assertThat(setList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkContentIsRequired() throws Exception {
        int databaseSizeBeforeTest = setRepository.findAll().size();
        // set the field null
        set.setContent(null);

        // Create the Set, which fails.

        restSetMockMvc.perform(post("/api/sets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(set)))
            .andExpect(status().isBadRequest());

        List<Set> setList = setRepository.findAll();
        assertThat(setList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllSets() throws Exception {
        // Initialize the database
        setRepository.saveAndFlush(set);

        // Get all the setList
        restSetMockMvc.perform(get("/api/sets?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(set.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())));
    }

    @Test
    @Transactional
    public void getSet() throws Exception {
        // Initialize the database
        setRepository.saveAndFlush(set);

        // Get the set
        restSetMockMvc.perform(get("/api/sets/{id}", set.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(set.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE.toString()))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingSet() throws Exception {
        // Get the set
        restSetMockMvc.perform(get("/api/sets/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSet() throws Exception {
        // Initialize the database
        setRepository.saveAndFlush(set);
        int databaseSizeBeforeUpdate = setRepository.findAll().size();

        // Update the set
        Set updatedSet = setRepository.findOne(set.getId());
        updatedSet
            .title(UPDATED_TITLE)
            .content(UPDATED_CONTENT);

        restSetMockMvc.perform(put("/api/sets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSet)))
            .andExpect(status().isOk());

        // Validate the Set in the database
        List<Set> setList = setRepository.findAll();
        assertThat(setList).hasSize(databaseSizeBeforeUpdate);
        Set testSet = setList.get(setList.size() - 1);
        assertThat(testSet.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testSet.getContent()).isEqualTo(UPDATED_CONTENT);
    }

    @Test
    @Transactional
    public void updateNonExistingSet() throws Exception {
        int databaseSizeBeforeUpdate = setRepository.findAll().size();

        // Create the Set

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restSetMockMvc.perform(put("/api/sets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(set)))
            .andExpect(status().isCreated());

        // Validate the Set in the database
        List<Set> setList = setRepository.findAll();
        assertThat(setList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteSet() throws Exception {
        // Initialize the database
        setRepository.saveAndFlush(set);
        int databaseSizeBeforeDelete = setRepository.findAll().size();

        // Get the set
        restSetMockMvc.perform(delete("/api/sets/{id}", set.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Set> setList = setRepository.findAll();
        assertThat(setList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Set.class);
        Set set1 = new Set();
        set1.setId(1L);
        Set set2 = new Set();
        set2.setId(set1.getId());
        assertThat(set1).isEqualTo(set2);
        set2.setId(2L);
        assertThat(set1).isNotEqualTo(set2);
        set1.setId(null);
        assertThat(set1).isNotEqualTo(set2);
    }
}
