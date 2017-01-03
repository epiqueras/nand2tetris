// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

(LOOP)
  // Initialize or reset pointer
  @SCREEN
  D=A
  @pointer
  M=D

  // Clear screen if no key is pressed
  @KBD
  D=M
  @CLEAR
  D;JEQ

  // Fill screen
  @color
  M=-1
  @FILL
  0;JMP

(CLEAR) // Clear screen
  @color
  M=0
  @FILL
  0;JMP

(FILL)
  // Jump to loop when finished
  @pointer
  D=M
  @SCREEN
  D=D-A
  @8192
  D=D-A
  @LOOP
  D;JGE

  // Set bits
  @color
  D=M
  @pointer
  A=M
  M=D

  // Increase pointer
  @pointer
  M=M+1

  // loop
  @FILL
  0;JMP
