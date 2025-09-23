package pictet.com.adventurebook.backendapi.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@Schema(description = "Adventure book containing metadata and sections")
public class Book {
    @Schema(description = "Title of the adventure book", example = "The Lost Temple")
    private String title;

    @Schema(description = "Author of the adventure book", example = "John Doe")
    private String author;

    @Schema(description = "Difficulty level of the adventure book", example = "Medium")
    private String difficulty;

    @Schema(description = "Type or genre of the adventure book", example = "Fantasy")
    private String type;

    @Schema(description = "List of sections that make up the adventure book")
    private List<Section> sections;
}

