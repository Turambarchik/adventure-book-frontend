package pictet.com.adventurebook.backendapi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pictet.com.adventurebook.backendapi.domain.Book;
import pictet.com.adventurebook.backendapi.domain.BookSummary;
import pictet.com.adventurebook.backendapi.service.BookService;

import java.util.List;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
@Tag(name = "Book Management", description = "API for managing adventure books")
public class BookController {
    private final BookService bookService;

    @GetMapping
    @Operation(summary = "Get all books summary", description = "Retrieve a list of all available adventure book summary")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of book summary")
    })
    public List<BookSummary> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/{path}")
    @Operation(summary = "Get book by path", description = "Retrieve a specific adventure book by its path identifier")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the book"),
            @ApiResponse(responseCode = "404", description = "Book not found")
    })
    public Book getBookById(@Parameter(description = "Path identifier of the book to retrieve") @PathVariable String path) {
        return bookService.getBook(path);
    }

    @PostMapping("/progress/save")
    @Operation(summary = "Save reading progress", description = "Save the current reading progress for a specific book and section")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Progress saved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request parameters")
    })
    public void saveProgress(@Parameter(description = "Book identifier") @RequestParam String book,
                             @Parameter(description = "Section number where progress should be saved") @RequestParam long section) {
        bookService.saveProgress(book, section);
    }
}
