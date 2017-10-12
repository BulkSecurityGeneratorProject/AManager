package zvonimir.tomesic.web.rest;

import com.codahale.metrics.annotation.Timed;
import zvonimir.tomesic.domain.Set;

import zvonimir.tomesic.repository.SetRepository;
import zvonimir.tomesic.security.SecurityUtils;
import zvonimir.tomesic.web.rest.util.HeaderUtil;
import zvonimir.tomesic.web.rest.util.PaginationUtil;
import io.swagger.annotations.ApiParam;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Set.
 */
@RestController
@RequestMapping("/api")
public class SetResource {

    private final Logger log = LoggerFactory.getLogger(SetResource.class);

    private static final String ENTITY_NAME = "set";

    private final SetRepository setRepository;

    public SetResource(SetRepository setRepository) {
        this.setRepository = setRepository;
    }

    /**
     * POST  /sets : Create a new set.
     *
     * @param set the set to create
     * @return the ResponseEntity with status 201 (Created) and with body the new set, or with status 400 (Bad Request) if the set has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/sets")
    @Timed
    public ResponseEntity<Set> createSet(@Valid @RequestBody Set set) throws URISyntaxException {
        log.debug("REST request to save Set : {}", set);
        if (set.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new set cannot already have an ID")).body(null);
        }
        Set result = setRepository.save(set);
        return ResponseEntity.created(new URI("/api/sets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /sets : Updates an existing set.
     *
     * @param set the set to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated set,
     * or with status 400 (Bad Request) if the set is not valid,
     * or with status 500 (Internal Server Error) if the set couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/sets")
    @Timed
    public ResponseEntity<Set> updateSet(@Valid @RequestBody Set set) throws URISyntaxException {
        log.debug("REST request to update Set : {}", set);
        if (set.getId() == null) {
            return createSet(set);
        }
        Set result = setRepository.save(set);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, set.getId().toString()))
            .body(result);
    }

    /**
     * GET  /sets : get all the sets.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of sets in body
     */
    @GetMapping("/sets")
    @Timed
    public ResponseEntity<List<Set>> getAllSets(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of Sets");
        Page<Set> page = setRepository.findByCardsetUserLogin(SecurityUtils.getCurrentUserLogin(), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/sets");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /sets/:id : get the "id" set.
     *
     * @param id the id of the set to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the set, or with status 404 (Not Found)
     */
    @GetMapping("/sets/{id}")
    @Timed
    public ResponseEntity<Set> getSet(@PathVariable Long id) {
        log.debug("REST request to get Set : {}", id);
        Set set = setRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(set));
    }

    /**
     * DELETE  /sets/:id : delete the "id" set.
     *
     * @param id the id of the set to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/sets/{id}")
    @Timed
    public ResponseEntity<Void> deleteSet(@PathVariable Long id) {
        log.debug("REST request to delete Set : {}", id);
        setRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
