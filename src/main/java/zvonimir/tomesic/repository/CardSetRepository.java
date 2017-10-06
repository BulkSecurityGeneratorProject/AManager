package zvonimir.tomesic.repository;

import zvonimir.tomesic.domain.CardSet;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import java.util.List;

/**
 * Spring Data JPA repository for the CardSet entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CardSetRepository extends JpaRepository<CardSet, Long> {

    @Query("select card_set from CardSet card_set where card_set.user.login = ?#{principal.username}")
    List<CardSet> findByUserIsCurrentUser();

}
