package zvonimir.tomesic.web.rest;

import com.codahale.metrics.annotation.Timed;
import zvonimir.tomesic.domain.CardSet;

import zvonimir.tomesic.domain.User;
import zvonimir.tomesic.repository.CardSetRepository;
import zvonimir.tomesic.repository.UserRepository;
import zvonimir.tomesic.security.SecurityUtils;
import zvonimir.tomesic.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing CardSet.
 */
@RestController
@RequestMapping("/api")
public class CardSetResource {

    private final Logger log = LoggerFactory.getLogger(CardSetResource.class);

    private static final String ENTITY_NAME = "cardSet";

    private final CardSetRepository cardSetRepository;
    private final UserRepository userRepository;

    public CardSetResource(CardSetRepository cardSetRepository, UserRepository userRepository) {

        this.cardSetRepository = cardSetRepository;
        this.userRepository = userRepository;
    }

    /**
     * POST  /card-sets : Create a new cardSet.
     *
     * @param cardSet the cardSet to create
     * @return the ResponseEntity with status 201 (Created) and with body the new cardSet, or with status 400 (Bad Request) if the cardSet has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/card-sets")
    @Timed
    public ResponseEntity<CardSet> createCardSet(@Valid @RequestBody CardSet cardSet) throws URISyntaxException {
        log.debug("REST request to save CardSet : {}", cardSet);
        if (cardSet.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new cardSet cannot already have an ID")).body(null);
        }
        Optional<User> user = this.userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin());
        cardSet.setUser(user.get());
        CardSet result = cardSetRepository.save(cardSet);
        return ResponseEntity.created(new URI("/api/card-sets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /card-sets : Updates an existing cardSet.
     *
     * @param cardSet the cardSet to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated cardSet,
     * or with status 400 (Bad Request) if the cardSet is not valid,
     * or with status 500 (Internal Server Error) if the cardSet couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/card-sets")
    @Timed
    public ResponseEntity<CardSet> updateCardSet(@Valid @RequestBody CardSet cardSet) throws URISyntaxException {
        log.debug("REST request to update CardSet : {}", cardSet);
        if (cardSet.getId() == null) {
            return createCardSet(cardSet);
        }
        CardSet result = cardSetRepository.save(cardSet);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, cardSet.getId().toString()))
            .body(result);
    }

    /**
     * GET  /card-sets : get all the cardSets.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of cardSets in body
     */
    @GetMapping("/card-sets")
    @Timed
    public List<CardSet> getAllCardSets() {
        log.debug("REST request to get all CardSets that belong to current user");
        return cardSetRepository.findByUserIsCurrentUser();
        }

    /**
     * GET  /card-sets/:id : get the "id" cardSet.
     *
     * @param id the id of the cardSet to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the cardSet, or with status 404 (Not Found)
     */
    @GetMapping("/card-sets/{id}")
    @Timed
    public ResponseEntity<CardSet> getCardSet(@PathVariable Long id) {
        log.debug("REST request to get CardSet : {}", id);
        CardSet cardSet = cardSetRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(cardSet));
    }

    /**
     * DELETE  /card-sets/:id : delete the "id" cardSet.
     *
     * @param id the id of the cardSet to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/card-sets/{id}")
    @Timed
    public ResponseEntity<Void> deleteCardSet(@PathVariable Long id) {
        log.debug("REST request to delete CardSet : {}", id);
        cardSetRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
