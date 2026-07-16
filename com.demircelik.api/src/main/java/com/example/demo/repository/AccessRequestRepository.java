package com.example.demo.repository;

import com.example.demo.entity.AccessRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccessRequestRepository extends JpaRepository<AccessRequest, Long> {

    List<AccessRequest> findByStatus(String status);

    List<AccessRequest> findByRequesterIdOrderByRequestedAtDesc(Long requesterId);

    // Bir kullanıcının belirli bir kaynak için EN SON verilmiş kararını bulur
    // (onaylı ve hâlâ geçerli mi diye AccessControlService bunu kullanır)
    Optional<AccessRequest> findFirstByRequesterIdAndResourceAndStatusOrderByDecidedAtDesc(
            Long requesterId, String resource, String status);
}