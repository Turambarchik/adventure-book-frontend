package pictet.com.adventurebook.backendapi.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@Builder
@Schema(description = "Adventure book containing metadata and sections")
public class BookSummary {

    @Schema(description = "Path of the adventure book", example = "the-lost-temple.json")
    private String path;

    @Schema(description = "Title of the adventure book", example = "The Lost Temple")
    private String title;

    @Schema(description = "Author of the adventure book", example = "John Doe")
    private String author;

    @Schema(description = "Difficulty level of the adventure book", example = "Medium")
    private String difficulty;

    @Schema(description = "Type or genre of the adventure book", example = "Fantasy")
    private String type;

    @Schema(description = "Duration of the adventure book", example = "40-60 min")
    private String duration;

    @Schema(description = "Number of chapters of the adventure book", example = "2")
    private Integer chapters;

    @Schema(description = "Tags of the adventure book", example = "magic, underground")
    private List<String> tags;

    @Schema(description = "Summary of the adventure book", example = "Lorem ipsum...")
    private String summary;
}
