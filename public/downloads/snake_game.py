import pygame
import random
import sys

# Initialize Pygame
pygame.init()

# Constants
WINDOW_WIDTH = 800
WINDOW_HEIGHT = 600
GRID_SIZE = 20
GRID_WIDTH = WINDOW_WIDTH // GRID_SIZE
GRID_HEIGHT = WINDOW_HEIGHT // GRID_SIZE

# Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (0, 255, 0)
RED = (255, 0, 0)
BLUE = (0, 0, 255)
DARK_GREEN = (0, 200, 0)

class SnakeGame:
    def __init__(self):
        self.screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
        pygame.display.set_caption("Snake Game - SIGMA")
        self.clock = pygame.time.Clock()
        self.font = pygame.font.Font(None, 36)
        self.big_font = pygame.font.Font(None, 72)
        
        self.reset_game()
        
    def reset_game(self):
        self.snake = [(GRID_WIDTH // 2, GRID_HEIGHT // 2)]
        self.direction = (1, 0)
        self.food = self.generate_food()
        self.score = 0
        self.game_over = False
        self.paused = False
        
    def generate_food(self):
        while True:
            food = (random.randint(0, GRID_WIDTH - 1), random.randint(0, GRID_HEIGHT - 1))
            if food not in self.snake:
                return food
                
    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    return False
                elif event.key == pygame.K_r and self.game_over:
                    self.reset_game()
                elif event.key == pygame.K_SPACE:
                    self.paused = not self.paused
                elif not self.game_over and not self.paused:
                    if event.key == pygame.K_UP and self.direction != (0, 1):
                        self.direction = (0, -1)
                    elif event.key == pygame.K_DOWN and self.direction != (0, -1):
                        self.direction = (0, 1)
                    elif event.key == pygame.K_LEFT and self.direction != (1, 0):
                        self.direction = (-1, 0)
                    elif event.key == pygame.K_RIGHT and self.direction != (-1, 0):
                        self.direction = (1, 0)
        return True
        
    def update(self):
        if self.game_over or self.paused:
            return
            
        # Move snake
        head_x, head_y = self.snake[0]
        new_head = (head_x + self.direction[0], head_y + self.direction[1])
        
        # Check wall collision
        if (new_head[0] < 0 or new_head[0] >= GRID_WIDTH or 
            new_head[1] < 0 or new_head[1] >= GRID_HEIGHT):
            self.game_over = True
            return
            
        # Check self collision
        if new_head in self.snake:
            self.game_over = True
            return
            
        self.snake.insert(0, new_head)
        
        # Check food collision
        if new_head == self.food:
            self.score += 10
            self.food = self.generate_food()
        else:
            self.snake.pop()
            
    def draw(self):
        self.screen.fill(BLACK)
        
        # Draw grid
        for x in range(0, WINDOW_WIDTH, GRID_SIZE):
            pygame.draw.line(self.screen, (20, 20, 20), (x, 0), (x, WINDOW_HEIGHT))
        for y in range(0, WINDOW_HEIGHT, GRID_SIZE):
            pygame.draw.line(self.screen, (20, 20, 20), (0, y), (WINDOW_WIDTH, y))
        
        # Draw snake
        for i, segment in enumerate(self.snake):
            x, y = segment[0] * GRID_SIZE, segment[1] * GRID_SIZE
            color = GREEN if i == 0 else DARK_GREEN  # Head is brighter
            pygame.draw.rect(self.screen, color, (x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2))
            
        # Draw food
        food_x, food_y = self.food[0] * GRID_SIZE, self.food[1] * GRID_SIZE
        pygame.draw.rect(self.screen, RED, (food_x + 1, food_y + 1, GRID_SIZE - 2, GRID_SIZE - 2))
        
        # Draw score
        score_text = self.font.render(f"Score: {self.score}", True, WHITE)
        self.screen.blit(score_text, (10, 10))
        
        # Draw length
        length_text = self.font.render(f"Length: {len(self.snake)}", True, WHITE)
        self.screen.blit(length_text, (10, 50))
        
        # Draw game over screen
        if self.game_over:
            overlay = pygame.Surface((WINDOW_WIDTH, WINDOW_HEIGHT))
            overlay.set_alpha(128)
            overlay.fill(BLACK)
            self.screen.blit(overlay, (0, 0))
            
            game_over_text = self.big_font.render("GAME OVER", True, RED)
            score_text = self.font.render(f"Final Score: {self.score}", True, WHITE)
            restart_text = self.font.render("Press R to restart or ESC to quit", True, WHITE)
            
            self.screen.blit(game_over_text, (WINDOW_WIDTH // 2 - game_over_text.get_width() // 2, WINDOW_HEIGHT // 2 - 100))
            self.screen.blit(score_text, (WINDOW_WIDTH // 2 - score_text.get_width() // 2, WINDOW_HEIGHT // 2 - 50))
            self.screen.blit(restart_text, (WINDOW_WIDTH // 2 - restart_text.get_width() // 2, WINDOW_HEIGHT // 2))
            
        # Draw pause screen
        if self.paused and not self.game_over:
            overlay = pygame.Surface((WINDOW_WIDTH, WINDOW_HEIGHT))
            overlay.set_alpha(128)
            overlay.fill(BLACK)
            self.screen.blit(overlay, (0, 0))
            
            pause_text = self.big_font.render("PAUSED", True, BLUE)
            continue_text = self.font.render("Press SPACE to continue", True, WHITE)
            
            self.screen.blit(pause_text, (WINDOW_WIDTH // 2 - pause_text.get_width() // 2, WINDOW_HEIGHT // 2 - 50))
            self.screen.blit(continue_text, (WINDOW_WIDTH // 2 - continue_text.get_width() // 2, WINDOW_HEIGHT // 2))
        
        # Draw instructions
        if not self.game_over and not self.paused:
            instructions = [
                "Arrow Keys: Move",
                "SPACE: Pause",
                "ESC: Quit"
            ]
            for i, instruction in enumerate(instructions):
                text = self.font.render(instruction, True, WHITE)
                self.screen.blit(text, (WINDOW_WIDTH - 200, 10 + i * 30))
        
        pygame.display.flip()
        
    def run(self):
        running = True
        while running:
            running = self.handle_events()
            self.update()
            self.draw()
            self.clock.tick(10)  # 10 FPS for snake game
            
        pygame.quit()
        sys.exit()

if __name__ == "__main__":
    print("🐍 Snake Game - SIGMA")
    print("=" * 30)
    print("Controls:")
    print("• Arrow Keys: Move snake")
    print("• SPACE: Pause/Resume")
    print("• R: Restart (when game over)")
    print("• ESC: Quit game")
    print("=" * 30)
    print("Starting game...")
    
    game = SnakeGame()
    game.run()
