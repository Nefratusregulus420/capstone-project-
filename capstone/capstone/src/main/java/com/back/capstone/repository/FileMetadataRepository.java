package com.back.capstone.repository;
import com.back.capstone.entity.*; import java.util.*; import org.springframework.data.jpa.repository.JpaRepository;
public interface FileMetadataRepository extends JpaRepository<FileMetadata,Long>{
 List<FileMetadata> findByOwnerOrderByUploadedAtDesc(User owner); List<FileMetadata> findByOwnerAndCategoryOrderByUploadedAtDesc(User owner, FileCategory category);
 List<FileMetadata> findTop10ByOwnerOrderByUploadedAtDesc(User owner); Optional<FileMetadata> findByIdAndOwner(Long id, User owner);
 List<FileMetadata> findByOwnerAndOriginalNameContainingIgnoreCaseOrderByUploadedAtDesc(User owner,String query);
}
