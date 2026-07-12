package com.back.capstone.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name="file_metadata", indexes={@Index(name="idx_file_owner_uploaded", columnList="owner_id,uploadedAt"), @Index(name="idx_file_owner_category", columnList="owner_id,category")})
public class FileMetadata {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private String originalName;
 @Column(nullable=false, unique=true) private String storedName;
 @Column(nullable=false) private String mimeType;
 private String extension; @Column(nullable=false) private long size;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private FileCategory category;
 @Column(nullable=false, updatable=false) private Instant uploadedAt=Instant.now();
 @ManyToOne(optional=false, fetch=FetchType.LAZY) @JoinColumn(name="owner_id", nullable=false) private User owner;
 public Long getId(){return id;} public String getOriginalName(){return originalName;} public void setOriginalName(String v){originalName=v;}
 public String getStoredName(){return storedName;} public void setStoredName(String v){storedName=v;} public String getMimeType(){return mimeType;} public void setMimeType(String v){mimeType=v;}
 public String getExtension(){return extension;} public void setExtension(String v){extension=v;} public long getSize(){return size;} public void setSize(long v){size=v;}
 public FileCategory getCategory(){return category;} public void setCategory(FileCategory v){category=v;} public Instant getUploadedAt(){return uploadedAt;}
 public User getOwner(){return owner;} public void setOwner(User v){owner=v;}
}
