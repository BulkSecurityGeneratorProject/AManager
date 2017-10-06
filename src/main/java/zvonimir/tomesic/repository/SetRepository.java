package zvonimir.tomesic.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import zvonimir.tomesic.domain.Set;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Set entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SetRepository extends JpaRepository<Set, Long> {
    Page<Set> findByCardsetUserLogin(String currentUserLogin, Pageable pageable);
}
