#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "../include/Parser.h"
#include "../include/Coder.h"

char * _changeExt(char *filename);

int main(int argc, char *argv[]) {

  if (argv[1] == NULL) { exit(1); }

  char *buffer;
  size_t buffer_size = 100;

  buffer = malloc(buffer_size * sizeof(char));
  if (buffer == NULL) { printf("Buffer error.\n"); exit(1); }

  FILE *input_fp;
  input_fp = fopen(argv[1], "r");
  if (input_fp == NULL) { printf("Input file error.\n"); exit(1); }

  FILE *output_fp;
  char *out_filename = _changeExt(argv[1]);
  output_fp = fopen(out_filename, "w");
  if (output_fp == NULL) { printf("Output file error.\n"); exit(1); }

  int is_comm_or_space;
  int logicals = 0;
  char *instruction[3];
  char *coded_instruction;

  while (getline(&buffer, &buffer_size, input_fp) != -1) {
    is_comm_or_space = rm_comms_spaces(buffer);
    if (!is_comm_or_space) {
      parse(instruction, buffer);
      coded_instruction = code_instruction(instruction, out_filename, &logicals);
      fputs(coded_instruction, output_fp);
      free(coded_instruction);
    }
  }

  fclose(input_fp);
  fclose(output_fp);
  free(buffer);
  free(out_filename);

  printf("Program Translated.\n");
  return 0;
}

char * _changeExt(char *filename) {
  char *out_filename = malloc((strlen(filename) + 2) * sizeof(char));
  if (out_filename == NULL) { printf("Output filename error.\n"); exit(1); }
  strcpy(out_filename, filename);
  char *f_ext = strstr(out_filename, ".vm");
  strcpy(f_ext, ".asm\0");
  return out_filename;
}
