package pictet.com.adventurebook.backendapi.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pictet.com.adventurebook.backendapi.domain.Book;
import pictet.com.adventurebook.backendapi.domain.BookSummary;
import pictet.com.adventurebook.backendapi.domain.Progress;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {
    private final JsonService jsonService;

    public List<BookSummary> getAllBooks() {
        return List.of(
                BookSummary.builder()
                        .path("the-prisoner.json")
                        .title("The Prisoner")
                        .author("Daniel El Fuego")
                        .difficulty("HARD")
                        .type("Adventure")
                        .duration("40-60 min")
                        .chapters(6)
                        .tags(List.of("Prisoners", "Cage"))
                        .summary("""
                                The Prisoner follows the story of a man unjustly confined, struggling to preserve his identity and hope.
                                Inside the walls, he faces psychological torment as much as physical captivity.
                                Memories of freedom and loved ones keep him fighting against despair.
                                Slowly, he learns to resist manipulation and seeks meaning in his suffering.
                                The book explores resilience, justice, and the unbreakable will to remain free in spirit.
                                """)
                        .build(),
                BookSummary.builder()
                        .path("pirates-jade-sea.json")
                        .title("Pirates of the Jade Sea")
                        .author("Marina Blackwood")
                        .difficulty("MEDIUM")
                        .type("Adventure")
                        .duration("30-45 min")
                        .chapters(17)
                        .tags(List.of("Pirates", "Ocean", "Treasure"))
                        .summary("""
                                In the treacherous waters of the Jade Sea, rival pirate crews clash for control of hidden treasure routes.
                                Young captain Arin, seeking revenge for his father’s death, must navigate betrayal and shifting alliances.
                                A mysterious map surfaces, promising unimaginable riches but also awakening ancient sea legends.
                                As storms and battles rage, friendships are tested and loyalties are questioned.
                                Only those daring enough to face both men and monsters can claim the Jade Sea’s ultimate prize.
                                """)
                        .build(),
                BookSummary.builder()
                        .path("crystal-caverns.json")
                        .title("The Crystal Caverns")
                        .author("Evelyn Stormrider")
                        .difficulty("EASY")
                        .type("Fantasy")
                        .duration("45-60 min")
                        .chapters(13)
                        .tags(List.of("Magic", "Underground", "Crystals"))
                        .summary("""
                                In The Crystal Caverns, a young adventurer discovers a hidden world beneath the mountains, filled with dazzling crystals and ancient secrets. As they explore, they uncover a mysterious power that could change their village forever. Facing treacherous traps and mythical creatures, they must rely on courage and wit to survive. Along the way, unexpected alliances form, revealing the true strength of friendship. Ultimately, the journey teaches that bravery and heart are more powerful than any treasure.
                                """)
                        .build(),
                BookSummary.builder()
                        .path("space-war.json")
                        .title("Space War")
                        .author("Evelyn Stormrider")
                        .difficulty("EASY")
                        .type("Adventure")
                        .duration("25-35 min")
                        .chapters(6)
                        .tags(List.of("Space", "War"))
                        .summary("""
                                In Space War, humanity faces an unprecedented interstellar conflict as rival alien civilizations clash across distant galaxies. Captain Aria Steele leads a diverse crew on a mission to secure a powerful artifact that could turn the tide of war. Along the way, they encounter deadly space battles, treacherous alliances, and mysterious cosmic phenomena. Aria must navigate loyalty, betrayal, and her own fears to protect her crew and the future of Earth. Ultimately, the story explores the cost of war and the resilience of hope in the face of the unknown.
                                """)
                        .build(),
                BookSummary.builder()
                        .path("dragon-quest.json")
                        .title("Dragon Quest")
                        .author("Evelyn Stormrider")
                        .difficulty("MEDIUM")
                        .type("Adventure")
                        .duration("35-45 min")
                        .chapters(12)
                        .tags(List.of("Dragon", "Quest"))
                        .summary("In Dragon Quest, a young hero embarks on a perilous journey to save the kingdom from a dark and powerful evil. Along the way, they gather a group of loyal companions, each with unique skills and backgrounds. The party faces fierce monsters, treacherous dungeons, and magical challenges that test their courage and friendship. Through battles and trials, the hero uncovers hidden truths about their past and the source of the kingdom’s threat. Ultimately, their bravery and unity determine the fate of the realm.")
                        .build()
        );
    }

    public Book getBook(String path) {
        final var jsonData = jsonService.readJson(path);
        final var mapper = new ObjectMapper();
        try {
            return mapper.readValue(jsonData, Book.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public List<Progress> listProgress(String book) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void saveProgress(String book, long section) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}
