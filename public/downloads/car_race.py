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
GRAY = (128, 128, 128)
DARK_GRAY = (64, 64, 64)

class Car:
    def __init__(self, x, y, color, is_player=False):
        self.x = x
        self.y = y
        self.width = 30
        self.height = 60
        self.color = color
        self.speed = 0
        self.max_speed = 8 if is_player else random.uniform(2, 5)
        self.is_player = is_player
        self.angle = 0
        
    def update(self):
        if not self.is_player:
            # AI car behavior
            self.speed = self.max_speed
            self.y += self.speed
            
            # Reset position when off screen
            if self.y > WINDOW_HEIGHT + 100:
                self.y = -100
                self.x = random.randint(100, WINDOW_WIDTH - 100)
                self.max_speed = random.uniform(2, 5)
                
    def draw(self, screen):
        # Draw car as rectangle
        car_rect = pygame.Rect(self.x - self.width // 2, self.y - self.height // 2, self.width, self.height)
        pygame.draw.rect(screen, self.color, car_rect)
        pygame.draw.rect(screen, WHITE, car_rect, 2)
        
        # Draw windows
        window_rect = pygame.Rect(self.x - self.width // 3, self.y - self.height // 3, self.width // 1.5, self.height // 3)
        pygame.draw.rect(screen, BLUE, window_rect)
        
    def get_rect(self):
        return pygame.Rect(self.x - self.width // 2, self.y - self.height // 2, self.width, self.height)

class CarRace:
    def __init__(self):
        self.screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
        pygame.display.set_caption("Car Race - SIGMA")
        self.clock = pygame.time.Clock()
        self.font = pygame.font.Font(None, 36)
        self.big_font = pygame.font.Font(None, 72)
        
        self.reset_game()
        
    def reset_game(self):
        self.player_car = Car(WINDOW_WIDTH // 2, WINDOW_HEIGHT - 100, GREEN, True)
        self.enemy_cars = []
        self.score = 0
        self.game_over = False
        self.paused = False
        self.road_y = 0
        self.spawn_timer = 0
        self.spawn_delay = 120  # Spawn new car every 2 seconds
        self.speed_increase_timer = 0
        
        # Create initial enemy cars
        for i in range(3):
            x = random.randint(100, WINDOW_WIDTH - 100)
            y = random.randint(-300, -100)
            color = random.choice([RED, BLUE, YELLOW, WHITE])
            self.enemy_cars.append(Car(x, y, color))
            
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
                    
        # Handle continuous key presses
        if not self.game_over and not self.paused:
            keys = pygame.key.get_pressed()
            if keys[pygame.K_LEFT] or keys[pygame.K_a]:
                self.player_car.x -= 5
            if keys[pygame.K_RIGHT] or keys[pygame.K_d]:
                self.player_car.x += 5
            if keys[pygame.K_UP] or keys[pygame.K_w]:
                self.player_car.speed = min(self.player_car.max_speed, self.player_car.speed + 0.5)
            if keys[pygame.K_DOWN] or keys[pygame.K_s]:
                self.player_car.speed = max(0, self.player_car.speed - 0.5)
            else:
                # Gradual deceleration
                self.player_car.speed = max(0, self.player_car.speed - 0.2)
                
        # Keep player car on screen
        self.player_car.x = max(50, min(WINDOW_WIDTH - 50, self.player_car.x))
        
        return True
        
    def update(self):
        if self.game_over or self.paused:
            return
            
        # Update score based on speed and time
        self.score += int(self.player_car.speed)
        
        # Update road animation
        self.road_y += 5
        if self.road_y >= 40:
            self.road_y = 0
            
        # Update cars
        for car in self.enemy_cars:
            car.update()
            
        # Spawn new enemy cars
        self.spawn_timer += 1
        if self.spawn_timer >= self.spawn_delay:
            x = random.randint(100, WINDOW_WIDTH - 100)
            y = random.randint(-200, -100)
            color = random.choice([RED, BLUE, YELLOW, WHITE])
            self.enemy_cars.append(Car(x, y, color))
            self.spawn_timer = 0
            
        # Increase difficulty over time
        self.speed_increase_timer += 1
        if self.speed_increase_timer >= 600:  # Every 10 seconds
            self.spawn_delay = max(60, self.spawn_delay - 5)
            for car in self.enemy_cars:
                car.max_speed += 0.2
            self.speed_increase_timer = 0
            
        # Check collisions
        player_rect = self.player_car.get_rect()
        for car in self.enemy_cars:
            if player_rect.colliderect(car.get_rect()):
                self.game_over = True
                break
                
        # Remove cars that are too far off screen
        self.enemy_cars = [car for car in self.enemy_cars if car.y < WINDOW_HEIGHT + 200]
        
    def draw_road(self):
        # Draw road background
        pygame.draw.rect(self.screen, DARK_GRAY, (50, 0, WINDOW_WIDTH - 100, WINDOW_HEIGHT))
        
        # Draw road lines
        for y in range(-40, WINDOW_HEIGHT + 40, 40):
            line_y = y + self.road_y
            pygame.draw.rect(self.screen, WHITE, (WINDOW_WIDTH // 2 - 2, line_y, 4, 20))
            
        # Draw road edges
        pygame.draw.rect(self.screen, WHITE, (50, 0, 5, WINDOW_HEIGHT))
        pygame.draw.rect(self.screen, WHITE, (WINDOW_WIDTH - 55, 0, 5, WINDOW_HEIGHT))
        
    def draw(self):
        self.screen.fill(GREEN)  # Grass background
        
        # Draw road
        self.draw_road()
        
        # Draw cars
        for car in self.enemy_cars:
            car.draw(self.screen)
        self.player_car.draw(self.screen)
        
        # Draw UI
        score_text = self.font.render(f"Score: {self.score}", True, WHITE)
        speed_text = self.font.render(f"Speed: {int(self.player_car.speed)}", True, WHITE)
        cars_text = self.font.render(f"Cars: {len(self.enemy_cars)}", True, WHITE)
        
        self.screen.blit(score_text, (10, 10))
        self.screen.blit(speed_text, (10, 50))
        self.screen.blit(cars_text, (10, 90))
        
        # Draw speedometer
        speed_ratio = self.player_car.speed / self.player_car.max_speed
        pygame.draw.rect(self.screen, WHITE, (WINDOW_WIDTH - 120, 20, 100, 20), 2)
        pygame.draw.rect(self.screen, GREEN, (WINDOW_WIDTH - 118, 22, int(96 * speed_ratio), 16))
        
        # Draw game over screen
        if self.game_over:
            overlay = pygame.Surface((WINDOW_WIDTH, WINDOW_HEIGHT))
            overlay.set_alpha(128)
            overlay.fill(BLACK)
            self.screen.blit(overlay, (0, 0))
            
            game_over_text = self.big_font.render("CRASH!", True, RED)
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
                "Arrow Keys/WASD: Drive",
                "SPACE: Pause",
                "ESC: Quit"
            ]
            for i, instruction in enumerate(instructions):
                text = self.font.render(instruction, True, WHITE)
                self.screen.blit(text, (WINDOW_WIDTH - 250, WINDOW_HEIGHT - 100 + i * 25))
        
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
    print("🏎️ Car Race - SIGMA")
    print("=" * 30)
    print("Controls:")
    print("• Arrow Keys or WASD: Drive car")
    print("• SPACE: Pause/Resume")
    print("• R: Restart (when crashed)")
    print("• ESC: Quit game")
    print("=" * 30)
    print("Objective: Avoid other cars and drive as far as possible!")
    print("Starting game...")
    
    game = CarRace()
    game.run()
