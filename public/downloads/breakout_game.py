import pygame
import random
import math
import sys

# Initialize Pygame
pygame.init()

# Constants
WINDOW_WIDTH = 800
WINDOW_HEIGHT = 600
FPS = 60

# Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)
YELLOW = (255, 255, 0)
ORANGE = (255, 165, 0)
PURPLE = (128, 0, 128)
CYAN = (0, 255, 255)
PINK = (255, 192, 203)

class Ball:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.radius = 10
        self.speed_x = random.choice([-4, 4])
        self.speed_y = -4
        self.max_speed = 8
        
    def update(self):
        self.x += self.speed_x
        self.y += self.speed_y
        
        # Bounce off walls
        if self.x - self.radius <= 0 or self.x + self.radius >= WINDOW_WIDTH:
            self.speed_x *= -1
        if self.y - self.radius <= 0:
            self.speed_y *= -1
            
    def draw(self, screen):
        pygame.draw.circle(screen, WHITE, (int(self.x), int(self.y)), self.radius)
        pygame.draw.circle(screen, CYAN, (int(self.x), int(self.y)), self.radius - 2)
        
    def get_rect(self):
        return pygame.Rect(self.x - self.radius, self.y - self.radius, 
                          self.radius * 2, self.radius * 2)

class Paddle:
    def __init__(self):
        self.width = 100
        self.height = 15
        self.x = WINDOW_WIDTH // 2 - self.width // 2
        self.y = WINDOW_HEIGHT - 50
        self.speed = 8
        
    def update(self, keys):
        if keys[pygame.K_LEFT] or keys[pygame.K_a]:
            self.x -= self.speed
        if keys[pygame.K_RIGHT] or keys[pygame.K_d]:
            self.x += self.speed
            
        # Keep paddle on screen
        self.x = max(0, min(WINDOW_WIDTH - self.width, self.x))
        
    def draw(self, screen):
        paddle_rect = pygame.Rect(self.x, self.y, self.width, self.height)
        pygame.draw.rect(screen, WHITE, paddle_rect)
        pygame.draw.rect(screen, GREEN, paddle_rect, 3)
        
    def get_rect(self):
        return pygame.Rect(self.x, self.y, self.width, self.height)

class Brick:
    def __init__(self, x, y, color, points):
        self.x = x
        self.y = y
        self.width = 75
        self.height = 30
        self.color = color
        self.points = points
        self.destroyed = False
        
    def draw(self, screen):
        if not self.destroyed:
            brick_rect = pygame.Rect(self.x, self.y, self.width, self.height)
            pygame.draw.rect(screen, self.color, brick_rect)
            pygame.draw.rect(screen, WHITE, brick_rect, 2)
            
    def get_rect(self):
        return pygame.Rect(self.x, self.y, self.width, self.height)

class BreakoutGame:
    def __init__(self):
        self.screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
        pygame.display.set_caption("Breakout Game - SIGMA")
        self.clock = pygame.time.Clock()
        self.font = pygame.font.Font(None, 36)
        self.big_font = pygame.font.Font(None, 72)
        
        self.reset_game()
        
    def reset_game(self):
        self.ball = Ball(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2)
        self.paddle = Paddle()
        self.bricks = []
        self.score = 0
        self.lives = 3
        self.level = 1
        self.game_over = False
        self.paused = False
        self.game_won = False
        
        self.create_bricks()
        
    def create_bricks(self):
        self.bricks = []
        colors = [RED, ORANGE, YELLOW, GREEN, BLUE, PURPLE, PINK]
        points = [50, 40, 30, 20, 10, 10, 10]
        
        rows = min(7, 3 + self.level)
        cols = 10
        
        for row in range(rows):
            for col in range(cols):
                x = col * 80 + 5
                y = row * 35 + 50
                color = colors[row % len(colors)]
                brick_points = points[row % len(points)]
                self.bricks.append(Brick(x, y, color, brick_points))
                
    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    return False
                elif event.key == pygame.K_r and (self.game_over or self.game_won):
                    self.reset_game()
                elif event.key == pygame.K_SPACE:
                    self.paused = not self.paused
                elif event.key == pygame.K_n and self.game_won:
                    self.next_level()
        return True
        
    def next_level(self):
        self.level += 1
        self.ball = Ball(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2)
        self.paddle = Paddle()
        self.create_bricks()
        self.game_won = False
        
        # Increase ball speed slightly
        self.ball.speed_x *= 1.1
        self.ball.speed_y *= 1.1
        
    def update(self):
        if self.game_over or self.paused or self.game_won:
            return
            
        keys = pygame.key.get_pressed()
        self.paddle.update(keys)
        self.ball.update()
        
        # Ball-paddle collision
        if self.ball.get_rect().colliderect(self.paddle.get_rect()) and self.ball.speed_y > 0:
            # Calculate bounce angle based on where ball hits paddle
            hit_pos = (self.ball.x - self.paddle.x) / self.paddle.width
            angle = (hit_pos - 0.5) * math.pi / 3  # Max 60 degrees
            speed = math.sqrt(self.ball.speed_x**2 + self.ball.speed_y**2)
            self.ball.speed_x = speed * math.sin(angle)
            self.ball.speed_y = -abs(speed * math.cos(angle))
            
        # Ball-brick collisions
        for brick in self.bricks:
            if not brick.destroyed and self.ball.get_rect().colliderect(brick.get_rect()):
                brick.destroyed = True
                self.score += brick.points
                self.ball.speed_y *= -1
                break
                
        # Check if ball is lost
        if self.ball.y > WINDOW_HEIGHT:
            self.lives -= 1
            if self.lives <= 0:
                self.game_over = True
            else:
                self.ball = Ball(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2)
                
        # Check if all bricks destroyed
        if all(brick.destroyed for brick in self.bricks):
            self.game_won = True
            
    def draw(self):
        self.screen.fill(BLACK)
        
        # Draw game objects
        self.ball.draw(self.screen)
        self.paddle.draw(self.screen)
        
        for brick in self.bricks:
            brick.draw(self.screen)
            
        # Draw UI
        score_text = self.font.render(f"Score: {self.score}", True, WHITE)
        lives_text = self.font.render(f"Lives: {self.lives}", True, WHITE)
        level_text = self.font.render(f"Level: {self.level}", True, WHITE)
        
        self.screen.blit(score_text, (10, 10))
        self.screen.blit(lives_text, (10, 50))
        self.screen.blit(level_text, (WINDOW_WIDTH - 120, 10))
        
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
            
        # Draw level complete screen
        if self.game_won:
            overlay = pygame.Surface((WINDOW_WIDTH, WINDOW_HEIGHT))
            overlay.set_alpha(128)
            overlay.fill(BLACK)
            self.screen.blit(overlay, (0, 0))
            
            win_text = self.big_font.render("LEVEL COMPLETE!", True, GREEN)
            score_text = self.font.render(f"Score: {self.score}", True, WHITE)
            next_text = self.font.render("Press N for next level or R to restart", True, WHITE)
            
            self.screen.blit(win_text, (WINDOW_WIDTH // 2 - win_text.get_width() // 2, WINDOW_HEIGHT // 2 - 100))
            self.screen.blit(score_text, (WINDOW_WIDTH // 2 - score_text.get_width() // 2, WINDOW_HEIGHT // 2 - 50))
            self.screen.blit(next_text, (WINDOW_WIDTH // 2 - next_text.get_width() // 2, WINDOW_HEIGHT // 2))
            
        # Draw pause screen
        if self.paused and not self.game_over and not self.game_won:
            overlay = pygame.Surface((WINDOW_WIDTH, WINDOW_HEIGHT))
            overlay.set_alpha(128)
            overlay.fill(BLACK)
            self.screen.blit(overlay, (0, 0))
            
            pause_text = self.big_font.render("PAUSED", True, BLUE)
            continue_text = self.font.render("Press SPACE to continue", True, WHITE)
            
            self.screen.blit(pause_text, (WINDOW_WIDTH // 2 - pause_text.get_width() // 2, WINDOW_HEIGHT // 2 - 50))
            self.screen.blit(continue_text, (WINDOW_WIDTH // 2 - continue_text.get_width() // 2, WINDOW_HEIGHT // 2))
            
        # Draw instructions
        if not self.game_over and not self.paused and not self.game_won:
            instructions = [
                "A/D or ←/→: Move paddle",
                "SPACE: Pause",
                "ESC: Quit"
            ]
            for i, instruction in enumerate(instructions):
                text = self.font.render(instruction, True, WHITE)
                self.screen.blit(text, (WINDOW_WIDTH - 250, WINDOW_HEIGHT - 80 + i * 25))
        
        pygame.display.flip()
        
    def run(self):
        running = True
        while running:
            running = self.handle_events()
            self.update()
            self.draw()
            self.clock.tick(FPS)
            
        pygame.quit()
        sys.exit()

if __name__ == "__main__":
    print("🧱 Breakout Game - SIGMA")
    print("=" * 30)
    print("Controls:")
    print("• A/D or Arrow Keys: Move paddle")
    print("• SPACE: Pause/Resume")
    print("• R: Restart (when game over)")
    print("• N: Next level (when level complete)")
    print("• ESC: Quit game")
    print("=" * 30)
    print("Objective: Break all bricks with the ball!")
    print("Don't let the ball fall off the screen!")
    print("Starting game...")
    
    game = BreakoutGame()
    game.run()
