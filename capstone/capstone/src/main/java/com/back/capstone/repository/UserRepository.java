package com.back.capstone.repository;
import com.back.capstone.entity.User; import java.util.*; import org.springframework.data.jpa.repository.JpaRepository;
public interface UserRepository extends JpaRepository<User,Long>{ Optional<User> findByUsername(String username); Optional<User> findByEmail(String email); Optional<User> findByUsernameOrEmail(String username,String email); boolean existsByUsername(String username); boolean existsByEmail(String email); }
