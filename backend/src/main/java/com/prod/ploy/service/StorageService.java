package com.prod.ploy.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

/**
 * Abstraction over the file storage backend.
 *
 * Implementations:
 *   - LocalStorageService  — stores files on the local filesystem (dev / VPS with persistent volume)
 *   - S3StorageService     — stores files in Amazon S3 (future)
 *   - R2StorageService     — stores files in Cloudflare R2 (future)
 *
 * The backing implementation is decided separately from this interface (see TODOS.md T-STORAGE).
 * Controllers and services always depend on this interface, never on a concrete impl.
 */
public interface StorageService {

    /**
     * Store an uploaded file and return an internal key/path.
     * The returned value is stored in Deliverable.fileUrl and is never exposed in API responses.
     *
     * @param file the uploaded file
     * @return an internal storage key (relative path, object key, etc.)
     */
    String store(MultipartFile file);

    /**
     * Load a file by its internal storage key as a streamable Resource.
     *
     * @param fileUrl the value previously returned by store()
     * @return a Resource ready for streaming
     * @throws StorageFileNotFoundException if no file exists at the given key
     */
    Resource load(String fileUrl);

    /**
     * Delete a file by its internal storage key. Best-effort; does not throw if missing.
     */
    void delete(String fileUrl);
}
