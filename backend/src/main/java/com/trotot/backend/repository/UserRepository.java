package com.trotot.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.trotot.backend.entity.RoleName;
import com.trotot.backend.entity.User;
import com.trotot.backend.entity.UserStatus;

public interface UserRepository extends JpaRepository<User, Long> {

    @EntityGraph(attributePaths = "roles")
    Optional<User> findByEmail(String email);

    @EntityGraph(attributePaths = "roles")
    Optional<User> findByGoogleId(String googleId);

    boolean existsByEmail(String email);

    @EntityGraph(attributePaths = "roles")
    @Query("""
            select distinct u from User u
            join u.roles role
            where role.name = :roleName
            """)
    List<User> findDistinctByRoleName(@Param("roleName") RoleName roleName);

    @Query("""
            select u from User u
            left join u.roles role
            where (:keyword is null
                or lower(u.fullName) like lower(concat('%', :keyword, '%'))
                or lower(u.email) like lower(concat('%', :keyword, '%'))
                or u.phone like concat('%', :keyword, '%'))
            and (:status is null or u.status = :status)
            and (:roleName is null or role.name = :roleName)
            """)
    Page<User> searchUsers(
            @Param("keyword") String keyword,
            @Param("status") UserStatus status,
            @Param("roleName") RoleName roleName,
            Pageable pageable);

    @Query("""
            select count(distinct u) from User u
            join u.roles role
            where role.name = :roleName
            """)
    long countDistinctByRoleName(@Param("roleName") RoleName roleName);
}
