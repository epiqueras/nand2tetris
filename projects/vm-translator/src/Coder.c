#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "../include/Coder.h"

char * _code_push(char *instruction[], char *filename);
char * _code_pop(char *instruction[], char *filename);
char * _code_arithmetic(char *instruction[], int *logicals);

char * __code_push_local(char *instruction[]);
char * __code_push_constant(char *instruction[]);
char * __code_push_argument(char *instruction[]);
char * __code_push_this(char *instruction[]);
char * __code_push_that(char *instruction[]);
char * __code_push_pointer(char *instruction[]);
char * __code_push_static(char *instruction[], char *filename);
char * __code_push_temp(char *instruction[]);

char * __code_pop_local(char *instruction[]);
char * __code_pop_argument(char *instruction[]);
char * __code_pop_this(char *instruction[]);
char * __code_pop_that(char *instruction[]);
char * __code_pop_pointer(char *instruction[]);
char * __code_pop_static(char *instruction[], char *filename);
char * __code_pop_temp(char *instruction[]);

char * __code_add();
char * __code_sub();
char * __code_neg();
char * __code_eq(int *logicals);
char * __code_gt(int *logicals);
char * __code_lt(int *logicals);
char * __code_and();
char * __code_or();
char * __code_not();

char * code_instruction(char *instruction[], char *filename, int *logicals) {
  if (strncmp(instruction[0], "push", 4) == 0) {
    return _code_push(instruction, filename);
  } else if (strncmp(instruction[0], "pop", 3) == 0) {
    return _code_pop(instruction, filename);
  } else {
    return _code_arithmetic(instruction, logicals);
  }
}

char * _code_push(char *instruction[], char *filename) {
  if (strncmp(instruction[1], "local", 5) == 0) {
    return __code_push_local(instruction);
  } else if (strncmp(instruction[1], "constant", 8) == 0) {
    return __code_push_constant(instruction);
  } else if (strncmp(instruction[1], "argument", 8) == 0) {
    return __code_push_argument(instruction);
  } else if (strncmp(instruction[1], "this", 4) == 0) {
    return __code_push_this(instruction);
  } else if (strncmp(instruction[1], "that", 4) == 0) {
    return __code_push_that(instruction);
  } else if (strncmp(instruction[1], "pointer", 7) == 0) {
    return __code_push_pointer(instruction);
  } else if (strncmp(instruction[1], "static", 6) == 0) {
    return __code_push_static(instruction, filename);
  } else if (strncmp(instruction[1], "temp", 4) == 0) {
    return __code_push_temp(instruction);
  } else{
    printf("Invalid syntax.\n"); exit(1);
  }
}

char * _code_pop(char *instruction[], char *filename) {
  if (strncmp(instruction[1], "local", 5) == 0) {
    return __code_pop_local(instruction);
  } else if (strncmp(instruction[1], "argument", 8) == 0) {
    return __code_pop_argument(instruction);
  } else if (strncmp(instruction[1], "this", 4) == 0) {
    return __code_pop_this(instruction);
  } else if (strncmp(instruction[1], "that", 4) == 0) {
    return __code_pop_that(instruction);
  } else if (strncmp(instruction[1], "pointer", 7) == 0) {
    return __code_pop_pointer(instruction);
  } else if (strncmp(instruction[1], "static", 6) == 0) {
    return __code_pop_static(instruction, filename);
  } else if (strncmp(instruction[1], "temp", 4) == 0) {
    return __code_pop_temp(instruction);
  } else{
    printf("Invalid syntax.\n"); exit(1);
  }
}

char * _code_arithmetic(char *instruction[], int *logicals) {
  if (strncmp(instruction[1], "add", 3) == 0) {
    return __code_add();
  } else if (strncmp(instruction[1], "sub", 3) == 0) {
    return __code_sub();
  } else if (strncmp(instruction[1], "neg", 3) == 0) {
    return __code_neg();
  } else if (strncmp(instruction[1], "eq", 2) == 0) {
    return __code_eq(logicals);
  } else if (strncmp(instruction[1], "gt", 2) == 0) {
    return __code_gt(logicals);
  } else if (strncmp(instruction[1], "lt", 2) == 0) {
    return __code_lt(logicals);
  } else if (strncmp(instruction[1], "and", 3) == 0) {
    return __code_and();
  } else if (strncmp(instruction[1], "or", 2) == 0) {
    return __code_or();
  } else if (strncmp(instruction[1], "not", 3) == 0) {
    return __code_not();
  } else {
    printf("Invalid syntax.\n"); exit(1);
  }
}

char * __code_push_local(char *instruction[]) {
  char *code = malloc(sizeof(char) * 90 );
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@%s\n\
D=A\n\
@LCL\n\
A=M+D\n\
D=M\n\
@SP\n\
M=M+1\n\
A=M-1\n\
M=D\n\
", instruction[2]);
  return code;
}

char * __code_push_constant(char *instruction[]) {
  char *code = malloc(sizeof(char) * 60 );
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@%s\n\
D=A\n\
@SP\n\
M=M+1\n\
A=M-1\n\
M=D\n\
", instruction[2]);
  return code;
}

char * __code_push_argument(char *instruction[]) {
  char *code = malloc(sizeof(char) * 90 );
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@%s\n\
D=A\n\
@ARG\n\
A=M+D\n\
D=M\n\
@SP\n\
M=M+1\n\
A=M-1\n\
M=D\n\
", instruction[2]);
  return code;
}

char * __code_push_this(char *instruction[]) {
  char *code = malloc(sizeof(char) * 90 );
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@%s\n\
D=A\n\
@THIS\n\
A=M+D\n\
D=M\n\
@SP\n\
M=M+1\n\
A=M-1\n\
M=D\n\
", instruction[2]);
  return code;
}

char * __code_push_that(char *instruction[]) {
  char *code = malloc(sizeof(char) * 90 );
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@%s\n\
D=A\n\
@THAT\n\
A=M+D\n\
D=M\n\
@SP\n\
M=M+1\n\
A=M-1\n\
M=D\n\
", instruction[2]);
  return code;
}

char * __code_push_pointer(char *instruction[]) {
  int addr = atoi(instruction[2]) + 3;
  char *code = malloc(sizeof(char) * 60 );
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@%d\n\
D=M\n\
@SP\n\
M=M+1\n\
A=M-1\n\
M=D\n\
", addr);
  return code;
}

char * __code_push_static(char *instruction[], char *filename) {
  char *file_name;
  char *tmp_str = malloc((strlen(filename) + 1) * sizeof(char));
  if (tmp_str == NULL) { printf("Error allocating memory.\n"); exit(1); }

  strcpy(tmp_str, filename);
  while ((file_name = strsep(&tmp_str, "/")) && tmp_str != NULL);
  free(tmp_str);

  char *tmp2_str = malloc((strlen(filename) + 1) * sizeof(char));
  if (tmp2_str == NULL) { printf("Error allocating memory.\n"); exit(1); }
  strcpy(tmp2_str, file_name);

  file_name = strsep(&tmp2_str, ".");

  char *var_name = malloc(sizeof(char) * 100);
  if (var_name == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(var_name, "%s.%s", file_name, instruction[2]);
  free(file_name);
  char *code = malloc(sizeof(char) * 60 );
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@%s\n\
D=M\n\
@SP\n\
M=M+1\n\
A=M-1\n\
M=D\n\
", var_name);
  free(var_name);
  return code;
}

char * __code_push_temp(char *instruction[]) {
  int addr = atoi(instruction[2]) + 5;
  char *code = malloc(sizeof(char) * 60 );
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@%d\n\
D=M\n\
@SP\n\
M=M+1\n\
A=M-1\n\
M=D\n\
", addr);
  return code;
}

char * __code_pop_local(char *instruction[]) {
  char *code = malloc(sizeof(char) * 120 );
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@%s\n\
D=A\n\
@LCL\n\
D=D+M\n\
@R13\n\
M=D\n\
@SP\n\
AM=M-1\n\
D=M\n\
@R13\n\
A=M\n\
M=D\n\
", instruction[2]);
  return code;
}

char * __code_pop_argument(char *instruction[]) {
  char *code = malloc(sizeof(char) * 120 );
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@%s\n\
D=A\n\
@ARG\n\
D=D+M\n\
@R13\n\
M=D\n\
@SP\n\
AM=M-1\n\
D=M\n\
@R13\n\
A=M\n\
M=D\n\
", instruction[2]);
  return code;
}

char * __code_pop_this(char *instruction[]) {
  char *code = malloc(sizeof(char) * 120 );
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@%s\n\
D=A\n\
@THIS\n\
D=D+M\n\
@R13\n\
M=D\n\
@SP\n\
AM=M-1\n\
D=M\n\
@R13\n\
A=M\n\
M=D\n\
", instruction[2]);
  return code;
}

char * __code_pop_that(char *instruction[]) {
  char *code = malloc(sizeof(char) * 120 );
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@%s\n\
D=A\n\
@THAT\n\
D=D+M\n\
@R13\n\
M=D\n\
@SP\n\
AM=M-1\n\
D=M\n\
@R13\n\
A=M\n\
M=D\n\
", instruction[2]);
  return code;
}

char * __code_pop_pointer(char *instruction[]) {
  int addr = atoi(instruction[2]) + 3;
  char *code = malloc(sizeof(char) * 50 );
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@SP\n\
AM=M-1\n\
D=M\n\
@%d\n\
M=D\n\
", addr);
  return code;
}

char * __code_pop_static(char *instruction[], char *filename) {
  char *file_name;
  char *tmp_str = malloc((strlen(filename) + 1) * sizeof(char));
  if (tmp_str == NULL) { printf("Error allocating memory.\n"); exit(1); }

  strcpy(tmp_str, filename);
  while ((file_name = strsep(&tmp_str, "/")) && tmp_str != NULL);
  free(tmp_str);

  char *tmp2_str = malloc((strlen(filename) + 1) * sizeof(char));
  if (tmp2_str == NULL) { printf("Error allocating memory.\n"); exit(1); }
  strcpy(tmp2_str, file_name);

  file_name = strsep(&tmp2_str, ".");

  char *var_name = malloc(sizeof(char) * 100);
  if (var_name == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(var_name, "%s.%s", file_name, instruction[2]);
  free(file_name);
  char *code = malloc(sizeof(char) * 50 );
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@SP\n\
AM=M-1\n\
D=M\n\
@%s\n\
M=D\n\
", var_name);
  free(var_name);
  return code;
}

char * __code_pop_temp(char *instruction[]) {
  int addr = atoi(instruction[2]) + 5;
  char *code = malloc(sizeof(char) * 50 );
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@SP\n\
AM=M-1\n\
D=M\n\
@%d\n\
M=D\n\
", addr);
  return code;
}

char * __code_add() {
  char *code = malloc(sizeof(char) * 50 );
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@SP\n\
AM=M-1\n\
D=M\n\
A=A-1\n\
M=M+D\n\
");
  return code;
}

char * __code_sub() {
  char *code = malloc(sizeof(char) * 50 );
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@SP\n\
AM=M-1\n\
D=M\n\
A=A-1\n\
M=M-D\n\
");
  return code;
}

char * __code_neg() {
  char *code = malloc(sizeof(char) * 30 );
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@SP\n\
A=M-1\n\
M=-M\n\
");
  return code;
}

char * __code_eq(int *logicals) {
  char *code = malloc(sizeof(char) * 200 );
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@SP\n\
AM=M-1\n\
D=M\n\
A=A-1\n\
D=M-D\n\
@EQ%d\n\
D;JEQ\n\
@SP\n\
A=M-1\n\
M=0\n\
@EQD%d\n\
0;JMP\n\
(EQ%d)\n\
@SP\n\
A=M-1\n\
M=-1\n\
(EQD%d)\n\
", *logicals, *logicals, *logicals, *logicals);
  *logicals = *logicals + 1;
  return code;
}

char * __code_gt(int *logicals) {
  char *code = malloc(sizeof(char) * 200 );
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@SP\n\
AM=M-1\n\
D=M\n\
A=A-1\n\
D=M-D\n\
@GT%d\n\
D;JGT\n\
@SP\n\
A=M-1\n\
M=0\n\
@GTD%d\n\
0;JMP\n\
(GT%d)\n\
@SP\n\
A=M-1\n\
M=-1\n\
(GTD%d)\n\
", *logicals, *logicals, *logicals, *logicals);
  *logicals = *logicals + 1;
  return code;
}

char * __code_lt(int *logicals) {
  char *code = malloc(sizeof(char) * 200 );
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@SP\n\
AM=M-1\n\
D=M\n\
A=A-1\n\
D=M-D\n\
@LT%d\n\
D;JLT\n\
@SP\n\
A=M-1\n\
M=0\n\
@LTD%d\n\
0;JMP\n\
(LT%d)\n\
@SP\n\
A=M-1\n\
M=-1\n\
(LTD%d)\n\
", *logicals, *logicals, *logicals, *logicals);
  *logicals = *logicals + 1;
  return code;
}

char * __code_and() {
  char *code = malloc(sizeof(char) * 50 );
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@SP\n\
AM=M-1\n\
D=M\n\
A=A-1\n\
M=M&D\n\
");
  return code;
}

char * __code_or() {
  char *code = malloc(sizeof(char) * 50 );
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@SP\n\
AM=M-1\n\
D=M\n\
A=A-1\n\
M=M|D\n\
");
  return code;
}

char * __code_not() {
  char *code = malloc(sizeof(char) * 30 );
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@SP\n\
A=M-1\n\
M=!M\n\
");
  return code;
}
