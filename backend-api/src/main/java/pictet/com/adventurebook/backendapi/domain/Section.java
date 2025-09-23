package pictet.com.adventurebook.backendapi.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@Schema(description = "A section of an adventure book containing story text and possible choices")
class Section {
    @Schema(description = "Unique identifier for the section", example = "section_001")
    private String id;

    @Schema(description = "The story text content of this section", example = "You find yourself at a crossroads...")
    private String text;

    @Schema(description = "Type of section (e.g., story, choice, ending)", example = "choice")
    private String type;

    @Schema(description = "Available options/choices for the reader in this section")
    private List<Option> options;
}
