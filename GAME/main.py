import pygame
import sys
import random

# Initialize Pygame
pygame.init()

# Set up the display
WIDTH, HEIGHT = 800, 400
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Dinosaur Game")

# Load background image
background_image = pygame.image.load("background.jpg").convert()

# Define colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

# Load player image and resize it
player_image = pygame.image.load("player_image.png").convert_alpha()
player_image = pygame.transform.scale(player_image, (30, 30))  # Adjust size here

# Define player attributes
player_width, player_height = 30, 30
player_x, player_y = 100, HEIGHT - player_height
player_speed = 5
player_jump = False
player_jump_speed = 10
player_jump_height = 100

# Load obstacle textures
obstacle_textures = [
    pygame.image.load("obstacle_texture1.png").convert_alpha(),
    pygame.image.load("obstacle_texture2.png").convert_alpha(),
    pygame.image.load("obstacle_texture3.png").convert_alpha(),
]

# Define obstacle attributes
obstacle_width, obstacle_height = 40, 40
obstacle_x = WIDTH
obstacle_speed = 5
obstacle_min_height = 30
obstacle_max_height = 100

# Define game variables
score = 0
highest_score = 0
font = pygame.font.Font(None, 36)
collision = False

def draw_text(text, color, x, y):
    text_surface = font.render(text, True, color)
    screen.blit(text_surface, (x, y))

def draw_restart_button():
    pygame.draw.rect(screen, BLACK, (WIDTH // 2 - 100, HEIGHT // 2 - 25, 200, 50))
    draw_text("Restart", WHITE, WIDTH // 2 - 40, HEIGHT // 2 - 15)

def restart_game():
    global obstacle_x, score, collision, highest_score
    obstacle_x = WIDTH
    if score > highest_score:
        highest_score = score
    score = 0
    collision = False

# Function to generate random obstacle height
def random_obstacle_height():
    return random.randint(obstacle_min_height, obstacle_max_height)

# Main game loop
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE and not player_jump and not collision:
                player_jump = True
            elif event.key == pygame.K_r and collision:  # Restart the game
                restart_game()
        elif event.type == pygame.MOUSEBUTTONDOWN:
            mouse_x, mouse_y = pygame.mouse.get_pos()
            if WIDTH // 2 - 100 <= mouse_x <= WIDTH // 2 + 100 and HEIGHT // 2 - 25 <= mouse_y <= HEIGHT // 2 + 25:
                restart_game()

    # Move player
    if player_jump:
        if player_jump_height >= -100:
            neg = 1
            if player_jump_height < 0:
                neg = -1
            player_y -= (player_jump_height ** 2) * 0.002 * neg
            player_jump_height -= 5
        else:
            player_jump = False
            player_jump_height = 100

    # Move obstacles and update score only if no collision
    if not collision:
        obstacle_x -= obstacle_speed
        if obstacle_x < 0:
            obstacle_x = WIDTH
            score += 1
            obstacle_height = random_obstacle_height()

    # Collision detection
    if player_x + player_width > obstacle_x and player_x < obstacle_x + obstacle_width \
            and player_y + player_height > HEIGHT - obstacle_height:
        collision = True

    # Draw background image
    screen.blit(background_image, (0, 0))

    # Draw everything
    if not collision:
        screen.blit(player_image, (player_x, player_y))  # Draw player image
        obstacle_texture = random.choice(obstacle_textures)
        screen.blit(pygame.transform.scale(obstacle_texture, (obstacle_width, obstacle_height)), (obstacle_x, HEIGHT - obstacle_height))
        draw_text("Score: " + str(score), BLACK, 10, 10)
        draw_text("Highest: " + str(highest_score), BLACK, 10, 50)
    else:
        draw_restart_button()
        draw_text("Latest Score: " + str(score), BLACK, 10, 90)

    # Update the display
    pygame.display.flip()

    # Cap the frame rate
    pygame.time.Clock().tick(60)

# Quit Pygame
pygame.quit()
