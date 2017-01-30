#include <dirent.h> 
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "../include/Parser.h"
#include "../include/Coder.h"

char * _changeExt(char *filename, int is_directory);

int main(int argc, char *argv[]) {
  if (argv[1] == NULL) { exit(1); }
  char *arg_one;

  int number_of_files = 0;
  int is_directory = 0;
  char **file_names;

  DIR *d;
  struct dirent *dir;
  d = opendir(argv[1]);
  if (d) {
    if (argv[1][strlen(argv[1]) - 1] != '/') {
      arg_one = malloc(sizeof(char) * (strlen(argv[1]) + 2));
      strcpy(arg_one, argv[1]);
      strcpy(arg_one + strlen(arg_one), "/\0");
    } else {
      arg_one = malloc(sizeof(char) * (strlen(argv[1]) + 1));
      strcpy(arg_one, argv[1]);
    }

    while ((dir = readdir(d)) != NULL) {
      if (strlen(dir->d_name) > 3) {
        if (strncmp(dir->d_name + strlen(dir->d_name) - 3, ".vm", 3) == 0) {
          number_of_files++;
        }
      }
    }
    if (number_of_files > 0) {
      file_names = malloc(sizeof(char *) * number_of_files);
      if (file_names == NULL) { printf("Error allocating memory.\n"); exit(1); }
    } else {
      printf("No .vm files found.\n"); exit(1);
    }
    rewinddir(d);
    int file_index = 0;
    while ((dir = readdir(d)) != NULL) {
      if (strlen(dir->d_name) > 3) {
        if (strncmp(dir->d_name + strlen(dir->d_name) - 3, ".vm", 3) == 0) {
          file_names[file_index] = malloc(sizeof(char) * (strlen(dir->d_name) + strlen(arg_one) + 1));
          if (file_names[file_index] == NULL) { printf("Error allocating memory.\n"); exit(1); }
          strcpy(file_names[file_index], arg_one);
          strcpy(file_names[file_index] + strlen(arg_one), dir->d_name);
          file_index++;
        }
      }
    }
    closedir(d);
    printf("Translating directory...\n");
    is_directory = 1;
  } else {
    arg_one = malloc(sizeof(char) * (strlen(argv[1]) + 1));
    strcpy(arg_one, argv[1]);

    printf("Translating single file...\n");
    number_of_files++;
    file_names = malloc(sizeof(char *));
    if (file_names == NULL) { printf("Error allocating memory.\n"); exit(1); }
    file_names[0] = malloc(sizeof(char) * (strlen(arg_one) + 1));
    if (file_names[0] == NULL) { printf("Error allocating memory.\n"); exit(1); }
    strcpy(file_names[0], arg_one);
  }

  char *buffer;
  size_t buffer_size = 100;

  buffer = malloc(buffer_size * sizeof(char));
  if (buffer == NULL) { printf("Buffer error.\n"); exit(1); }

  FILE *output_fp;
  char *out_filename = _changeExt(arg_one, is_directory);
  output_fp = fopen(out_filename, "w");
  if (output_fp == NULL) { printf("Output file error.\n"); exit(1); }
  free(arg_one);

  char *bootstrap_code = malloc(sizeof(char) * 400);
  if (bootstrap_code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(bootstrap_code,
"\
@256\n\
D=A\n\
@SP\n\
M=D\n\
@__Bootstrap__$ret.0\n\
D=A\n\
@SP\n\
A=M\n\
M=D\n\
@LCL\n\
D=M\n\
@SP\n\
AM=M+1\n\
M=D\n\
@ARG\n\
D=M\n\
@SP\n\
AM=M+1\n\
M=D\n\
@THIS\n\
D=M\n\
@SP\n\
AM=M+1\n\
M=D\n\
@THAT\n\
D=M\n\
@SP\n\
AM=M+1\n\
M=D\n\
@SP\n\
MD=M+1\n\
@LCL\n\
M=D\n\
@5\n\
D=D-A\n\
@ARG\n\
M=D\n\
@Sys.init\n\
0;JMP\n\
(__Bootstrap__$ret.0)\n\
");
  fputs(bootstrap_code, output_fp);
  free(bootstrap_code);

  int logicals = 0;
  char current_func[100] = "";
  int returns = 0;

  for (int i = 0; i < number_of_files; i++) {
    FILE *input_fp;
    input_fp = fopen(file_names[i], "r");
    if (input_fp == NULL) { printf("Input file error.\n"); exit(1); }

    int is_comm_or_space;
    char *instruction[3];
    char *coded_instruction;

    char *file_name;
    char *tmp_str = malloc((strlen(file_names[i]) + 1) * sizeof(char));
    if (tmp_str == NULL) { printf("Error allocating memory.\n"); exit(1); }
    char *org_tmp_str = tmp_str;

    strcpy(tmp_str, file_names[i]);
    while ((file_name = strsep(&tmp_str, "/")) && tmp_str != NULL);
    
    file_name = strsep(&file_name, ".");

    while (getline(&buffer, &buffer_size, input_fp) != -1) {
      is_comm_or_space = rm_comms_spaces(buffer);
      if (!is_comm_or_space) {
        parse(instruction, buffer);
        coded_instruction = code_instruction(instruction, file_name, &logicals, current_func, &returns);
        fputs(coded_instruction, output_fp);
        free(coded_instruction);
      }
    }

    fclose(input_fp);
    free(org_tmp_str);
  }

  fclose(output_fp);
  free(buffer);
  free(out_filename);

  for (int i = 0; i < number_of_files; i++) {
    free(file_names[i]);
  }
  free(file_names);

  printf("Program Translated.\n");
  return 0;
}

char * _changeExt(char *filename, int is_directory) {
  if (!is_directory) {
    char *out_filename = malloc((strlen(filename) + 2) * sizeof(char));
    if (out_filename == NULL) { printf("Output filename error.\n"); exit(1); }
    strcpy(out_filename, filename);
    char *f_ext = strstr(out_filename, ".vm");
    strcpy(f_ext, ".asm\0");
    return out_filename;
  }
  char *file_name;
  char *tmp_str = malloc((strlen(filename) + 1) * sizeof(char));
  if (tmp_str == NULL) { printf("Error allocating memory.\n"); exit(1); }
  char *org_tmp_str = tmp_str;
  strcpy(tmp_str, filename);
  while ((file_name = strsep(&tmp_str, "/")) && tmp_str != NULL && tmp_str[0] != '\0');

  char *out_filename = malloc((strlen(filename) + strlen(file_name) + 4) * sizeof(char));
  if (out_filename == NULL) { printf("Output filename error.\n"); exit(1); }
  strcpy(out_filename, filename);
  int f_ext = strlen(filename);
  strcpy(out_filename + f_ext, file_name);
  f_ext += strlen(file_name);
  strcpy(out_filename + f_ext, ".asm\0");
  free(org_tmp_str);
  return out_filename;
}
