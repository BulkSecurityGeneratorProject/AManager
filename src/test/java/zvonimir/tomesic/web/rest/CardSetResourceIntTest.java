package zvonimir.tomesic.web.rest;

import zvonimir.tomesic.AManagerApp;

import zvonimir.tomesic.domain.CardSet;
import zvonimir.tomesic.repository.CardSetRepository;
import zvonimir.tomesic.repository.UserRepository;
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

import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the CardSetResource REST controller.
 *
 * @see CardSetResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AManagerApp.class)
public class CardSetResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private CardSetRepository cardSetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCardSetMockMvc;

    private CardSet cardSet;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CardSetResource cardSetResource = new CardSetResource(cardSetRepository, userRepository);
        this.restCardSetMockMvc = MockMvcBuilders.standaloneSetup(cardSetResource)
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
    public static CardSet createEntity(EntityManager em) {
        CardSet cardSet = new CardSet()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION);
        return cardSet;
    }

    @Before
    public void initTest() {
        cardSet = createEntity(em);
    }

    @Test
    @Transactional
    public void createCardSet() throws Exception {
        int databaseSizeBeforeCreate = cardSetRepository.findAll().size();

        // Create the CardSet
        restCardSetMockMvc.perform(post("/api/card-sets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cardSet)))
            .andExpect(status().isCreated());

        // Validate the CardSet in the database
        List<CardSet> cardSetList = cardSetRepository.findAll();
        assertThat(cardSetList).hasSize(databaseSizeBeforeCreate + 1);
        CardSet testCardSet = cardSetList.get(cardSetList.size() - 1);
        assertThat(testCardSet.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCardSet.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    public void createCardSetWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = cardSetRepository.findAll().size();

        // Create the CardSet with an existing ID
        cardSet.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCardSetMockMvc.perform(post("/api/card-sets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cardSet)))
            .andExpect(status().isBadRequest());

        // Validate the CardSet in the database
        List<CardSet> cardSetList = cardSetRepository.findAll();
        assertThat(cardSetList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = cardSetRepository.findAll().size();
        // set the field null
        cardSet.setName(null);

        // Create the CardSet, which fails.

        restCardSetMockMvc.perform(post("/api/card-sets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cardSet)))
            .andExpect(status().isBadRequest());

        List<CardSet> cardSetList = cardSetRepository.findAll();
        assertThat(cardSetList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = cardSetRepository.findAll().size();
        // set the field null
        cardSet.setDescription(null);

        // Create the CardSet, which fails.

        restCardSetMockMvc.perform(post("/api/card-sets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cardSet)))
            .andExpect(status().isBadRequest());

        List<CardSet> cardSetList = cardSetRepository.findAll();
        assertThat(cardSetList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllCardSets() throws Exception {
        // Initialize the database
        cardSetRepository.saveAndFlush(cardSet);

        // Get all the cardSetList
        restCardSetMockMvc.perform(get("/api/card-sets?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cardSet.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }

    @Test
    @Transactional
    public void getCardSet() throws Exception {
        // Initialize the database
        cardSetRepository.saveAndFlush(cardSet);

        // Get the cardSet
        restCardSetMockMvc.perform(get("/api/card-sets/{id}", cardSet.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(cardSet.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCardSet() throws Exception {
        // Get the cardSet
        restCardSetMockMvc.perform(get("/api/card-sets/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCardSet() throws Exception {
        // Initialize the database
        cardSetRepository.saveAndFlush(cardSet);
        int databaseSizeBeforeUpdate = cardSetRepository.findAll().size();

        // Update the cardSet
        CardSet updatedCardSet = cardSetRepository.findOne(cardSet.getId());
        updatedCardSet
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION);

        restCardSetMockMvc.perform(put("/api/card-sets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCardSet)))
            .andExpect(status().isOk());

        // Validate the CardSet in the database
        List<CardSet> cardSetList = cardSetRepository.findAll();
        assertThat(cardSetList).hasSize(databaseSizeBeforeUpdate);
        CardSet testCardSet = cardSetList.get(cardSetList.size() - 1);
        assertThat(testCardSet.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCardSet.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    public void updateNonExistingCardSet() throws Exception {
        int databaseSizeBeforeUpdate = cardSetRepository.findAll().size();

        // Create the CardSet

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restCardSetMockMvc.perform(put("/api/card-sets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cardSet)))
            .andExpect(status().isCreated());

        // Validate the CardSet in the database
        List<CardSet> cardSetList = cardSetRepository.findAll();
        assertThat(cardSetList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteCardSet() throws Exception {
        // Initialize the database
        cardSetRepository.saveAndFlush(cardSet);
        int databaseSizeBeforeDelete = cardSetRepository.findAll().size();

        // Get the cardSet
        restCardSetMockMvc.perform(delete("/api/card-sets/{id}", cardSet.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<CardSet> cardSetList = cardSetRepository.findAll();
        assertThat(cardSetList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CardSet.class);
        CardSet cardSet1 = new CardSet();
        cardSet1.setId(1L);
        CardSet cardSet2 = new CardSet();
        cardSet2.setId(cardSet1.getId());
        assertThat(cardSet1).isEqualTo(cardSet2);
        cardSet2.setId(2L);
        assertThat(cardSet1).isNotEqualTo(cardSet2);
        cardSet1.setId(null);
        assertThat(cardSet1).isNotEqualTo(cardSet2);
    }
}
