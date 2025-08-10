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

class Target:
    def __init__(self, x, y, radius, speed, points):
        self.x = x
        self.y = y
        self.radius = radius
        self.speed = speed
        self.points = points
        self.direction_x = random.choice([-1, 1])
        self.direction_y = random.choice([-1, 1])
        self.color = random.choice([RED, GREEN, BLUE, YELLOW, ORANGE, PURPLE])
        
    def update(self):
        self.x += self.speed * self.direction_x
        self.y += self.speed * self.direction_y
        
        # Bounce off walls
        if self.x - self.radius <= 0 or self.x + self.radius >= WINDOW_WIDTH:
            self.direction_x *= -1
        if self.y - self.radius <= 0 or self.y + self.radius >= WINDOW_HEIGHT:
            self.direction_y *= -1
            
        # Keep within bounds
        self.x = max(self.radius, min(WINDOW_WIDTH - self.radius, self.x))
        self.y = max(self.radius, min(WINDOW_HEIGHT - self.radius, self.y))
        
    def draw(self, screen):
        # Draw target with rings
        pygame.draw.circle(screen, self.color, (int(self.x), int(self.y)), self.radius)
        pygame.draw.circle(screen, WHITE, (int(self.x), int(self.y)), self.radius, 2)
        pygame.draw.circle(screen, WHITE, (int(self.x), int(self.y)), self.radius // 2, 1)
        
    def is_hit(self, mouse_x, mouse_y):
        distance = math.sqrt((self.x - mouse_x) ** 2 + (self.y - mouse_y) ** 2)
        return distance <= self.radius

class TargetShooter:
    def __init__(self):
        self.screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
        pygame.display.set_caption("Target Shooter - SIGMA")
        self.clock = pygame.time.Clock()
        self.font = pygame.font.Font(None, 36)
        self.big_font = pygame.font.Font(None, 72)
        
        self.reset_game()
        
    def reset_game(self):
        self.targets = []
        self.score = 0
        self.shots_fired = 0
        self.hits = 0
        self.level = 1
        self.game_over = False
        self.paused = False
        self.time_left = 60  # 60 seconds per level
        self.spawn_timer = 0
        self.spawn_delay = 120  # Spawn new target every 2 seconds at 60 FPS
        
        # Create initial targets
        self.spawn_targets(3)
        
    def spawn_targets(self, count):
        for _ in range(count):
            x = random.randint(50, WINDOW_WIDTH - 50)
            y = random.randint(50, WINDOW_HEIGHT - 50)
            radius = random.randint(20, 40)
            speed = random.uniform(1, 3) + (self.level * 0.5)
            points = max(1, 50 - radius)  # Smaller targets worth more points
            
            self.targets.append(Target(x, y, radius, speed, points))
            
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
            elif event.type == pygame.MOUSEBUTTONDOWN:
                if event.button == 1 and not self.game_over and not self.paused:  # Left click
                    self.shoot(event.pos)
        return True
        
    def shoot(self, mouse_pos):
        self.shots_fired += 1
        mouse_x, mouse_y = mouse_pos
        
        # Check if any target is hit
        for target in self.targets[:]:  # Use slice to avoid modification during iteration
            if target.is_hit(mouse_x, mouse_y):
                self.score += target.points
                self.hits += 1
                self.targets.remove(target)
                break
                
    def update(self):
        if self.game_over or self.paused:
            return
            
        # Update time
        self.time_left -= 1/FPS
        if self.time_left <= 0:
            if len(self.targets) == 0:
                # Level complete
                self.level += 1
                self.time_left = 60
                self.spawn_targets(3 + self.level)
                self.spawn_delay = max(60, self.spawn_delay - 10)  # Faster spawning
            else:
                self.game_over = True
                
        # Update targets
        for target in self.targets:
            target.update()
            
        # Spawn new targets
        self.spawn_timer += 1
        if self.spawn_timer >= self.spawn_delay and len(self.targets) < 8:
            self.spawn_targets(1)
            self.spawn_timer = 0
            
    def draw(self):
        self.screen.fill(BLACK)
        
        # Draw targets
        for target in self.targets:
            target.draw(self.screen)
            
        # Draw crosshair at mouse position
        mouse_x, mouse_y = pygame.mouse.get_pos()
        pygame.draw.line(self.screen, WHITE, (mouse_x - 10, mouse_y), (mouse_x + 10, mouse_y), 2)
        pygame.draw.line(self.screen, WHITE, (mouse_x, mouse_y - 10), (mouse_x, mouse_y + 10), 2)
        pygame.draw.circle(self.screen, WHITE, (mouse_x, mouse_y), 15, 1)
        
        # Draw UI
        score_text = self.font.render(f"Score: {self.score}", True, WHITE)
        level_text = self.font.render(f"Level: {self.level}", True, WHITE)
        time_text = self.font.render(f"Time: {int(self.time_left)}", True, WHITE)
        targets_text = self.font.render(f"Targets: {len(self.targets)}", True, WHITE)
        
        self.screen.blit(score_text, (10, 10))
        self.screen.blit(level_text, (10, 50))
        self.screen.blit(time_text, (10, 90))
        self.screen.blit(targets_text, (10, 130))
        
        # Draw accuracy
        if self.shots_fired > 0:
            accuracy = (self.hits / self.shots_fired) * 100
            accuracy_text = self.font.render(f"Accuracy: {accuracy:.1f}%", True, WHITE)
            self.screen.blit(accuracy_text, (10, 170))
            
        # Draw game over screen
        if self.game_over:
            overlay = pygame.Surface((WINDOW_WIDTH, WINDOW_HEIGHT))
            overlay.set_alpha(128)
            overlay.fill(BLACK)
            self.screen.blit(overlay, (0, 0))
            
            game_over_text = self.big_font.render("GAME OVER", True, RED)
            score_text = self.font.render(f"Final Score: {self.score}", True, WHITE)
            level_text = self.font.render(f"Level Reached: {self.level}", True, WHITE)
            restart_text = self.font.render("Press R to restart or ESC to quit", True, WHITE)
            
            self.screen.blit(game_over_text, (WINDOW_WIDTH // 2 - game_over_text.get_width() // 2, WINDOW_HEIGHT // 2 - 100))
            self.screen.blit(score_text, (WINDOW_WIDTH // 2 - score_text.get_width() // 2, WINDOW_HEIGHT // 2 - 50))
            self.screen.blit(level_text, (WINDOW_WIDTH // 2 - level_text.get_width() // 2, WINDOW_HEIGHT // 2 - 20))
            self.screen.blit(restart_text, (WINDOW_WIDTH // 2 - restart_text.get_width() // 2, WINDOW_HEIGHT // 2 + 20))
            
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
                "Left Click: Shoot",
                "SPACE: Pause",
                "ESC: Quit"
            ]
            for i, instruction in enumerate(instructions):
                text = self.font.render(instruction, True, WHITE)
                self.screen.blit(text, (WINDOW_WIDTH - 200, 10 + i * 30))
        
        pygame.display.flip()
        
    def run(self):
        pygame.mouse.set_visible(False)  # Hide mouse cursor, we'll draw our own crosshair
        running = True
        while running:
            running = self.handle_events()
            self.update()
            self.draw()
            self.clock.tick(FPS)
            
        pygame.quit()
        sys.exit()

if __name__ == "__main__":
    print("🎯 Target Shooter - SIGMA")
    print("=" * 30)
    print("Controls:")
    print("• Left Click: Shoot targets")
    print("• SPACE: Pause/Resume")
    print("• R: Restart (when game over)")
    print("• ESC: Quit game")
    print("=" * 30)
    print("Objective: Shoot moving targets to score points!")
    print("Smaller targets = More points")
    print("Starting game...")
    
    game = TargetShooter()
    game.run()
