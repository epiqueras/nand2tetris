#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "../include/Coder.h"

char * _code_push(char *instruction[], char *filename);
char * _code_pop(char *instruction[], char *filename);
char * _code_arithmetic(char *instruction[], int *logicals);

char * _code_branching(char *instruction[], char *current_func);
char * _code_func_or_call(char *instruction[], char *current_func, int *returns);
char * _code_return();

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

char * __code_label(char *instruction[], char *current_func);
char * __code_goto(char *instruction[], char *current_func);
char * __code_if_goto(char *instruction[], char *current_func);

char * __code_function(char *instruction[], char *current_func, int *returns);
char * __code_call(char *instruction[], char *current_func, int *returns);

char * code_instruction(char *instruction[], char *filename, int *logicals, char *current_func, int *returns) {
  if (strncmp(instruction[0], "push", 4) == 0) {
    return _code_push(instruction, filename);
  } else if (strncmp(instruction[0], "pop", 3) == 0) {
    return _code_pop(instruction, filename);
  } else if ((strncmp(instruction[0], "label", 5) == 0) || (strncmp(instruction[0], "goto", 4) == 0) || (strncmp(instruction[0], "if-goto", 7) == 0)) {
    return _code_branching(instruction, current_func);
  } else if ((strncmp(instruction[0], "function", 8) == 0) || (strncmp(instruction[0], "call", 4) == 0)) {
    return _code_func_or_call(instruction, current_func, returns);
  } else if (strncmp(instruction[0], "return", 6) == 0) {
    return _code_return(instruction);
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

char * _code_branching(char *instruction[], char *current_func) {
  if (strncmp(instruction[0], "label", 5) == 0) {
    return __code_label(instruction, current_func);
  } else if (strncmp(instruction[0], "goto", 4) == 0) {
    return __code_goto(instruction, current_func);
  } else if (strncmp(instruction[0], "if-goto", 7) == 0) {
    return __code_if_goto(instruction, current_func);
  } else {
    printf("Invalid syntax.\n"); exit(1);
  }
}

char * _code_func_or_call(char *instruction[], char *current_func, int *returns) {
  if (strncmp(instruction[0], "function", 8) == 0) {
    return __code_function(instruction, current_func, returns);
  } else if (strncmp(instruction[0], "call", 4) == 0) {
    return __code_call(instruction, current_func, returns);
  } else {
    printf("Invalid syntax.\n"); exit(1);
  }
}

char * __code_push_local(char *instruction[]) {
  char *code = malloc(sizeof(char) * 90);
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
  char *code = malloc(sizeof(char) * 60);
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
  char *code = malloc(sizeof(char) * 90);
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
  char *code = malloc(sizeof(char) * 90);
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
  char *code = malloc(sizeof(char) * 90);
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
  char *code = malloc(sizeof(char) * 60);
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
  char *var_name = malloc(sizeof(char) * 100);
  if (var_name == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(var_name, "%s.%s", filename, instruction[2]);

  char *code = malloc(sizeof(char) * 60);
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
  char *code = malloc(sizeof(char) * 60);
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
  char *code = malloc(sizeof(char) * 120);
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
  char *code = malloc(sizeof(char) * 120);
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
  char *code = malloc(sizeof(char) * 120);
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
  char *code = malloc(sizeof(char) * 120);
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
  char *code = malloc(sizeof(char) * 50);
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
  char *var_name = malloc(sizeof(char) * 100);
  if (var_name == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(var_name, "%s.%s", filename, instruction[2]);

  char *code = malloc(sizeof(char) * 50);
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
  char *code = malloc(sizeof(char) * 50);
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
  char *code = malloc(sizeof(char) * 50);
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
  char *code = malloc(sizeof(char) * 50);
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
  char *code = malloc(sizeof(char) * 30);
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
  char *code = malloc(sizeof(char) * 200);
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
  char *code = malloc(sizeof(char) * 200);
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
  char *code = malloc(sizeof(char) * 200);
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
  char *code = malloc(sizeof(char) * 50);
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
  char *code = malloc(sizeof(char) * 50);
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
  char *code = malloc(sizeof(char) * 30);
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@SP\n\
A=M-1\n\
M=!M\n\
");
  return code;
}

char * __code_label(char *instruction[], char *current_func) {
  char *code = malloc(sizeof(char) * 100);
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
(%s$%s)\n\
", current_func, instruction[1]);
  return code;
}

char * __code_goto(char *instruction[], char *current_func) {
  char *code = malloc(sizeof(char) * 110);
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@%s$%s\n\
0;JMP\n\
", current_func, instruction[1]);
  return code;
}

char * __code_if_goto(char *instruction[], char *current_func) {
  char *code = malloc(sizeof(char) * 140);
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@SP\n\
AM=M-1\n\
D=M\n\
@%s$%s\n\
D;JNE\n\
", current_func, instruction[1]);
  return code;
}

char * __code_function(char *instruction[], char *current_func, int *returns) {
  int n_vars = atoi(instruction[2]);
  char *push_n_vars = malloc(sizeof(char) * ((n_vars * 20) + 101));
  if (push_n_vars == NULL) { printf("Error allocating memory.\n"); exit(1); }
  *push_n_vars = '\0';

  if (n_vars > 0) {
    strcat(push_n_vars,
"\
@0\n\
D=A\n\
@SP\n\
A=M\n\
M=D\n\
");

  for (int i = 1; i < n_vars; i++) {
    strcat(push_n_vars,
"\
A=A+1\n\
M=D\n\
");
  }

    sprintf(push_n_vars + strlen(push_n_vars),
"\
@%d\n\
D=A\n\
@SP\n\
M=M+D\n\
", n_vars);
  }

  char *code = malloc(sizeof(char) * (strlen(push_n_vars) + 101) );
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
(%s)\n\
%s\
", instruction[1], push_n_vars);
  free(push_n_vars);
  strcpy(current_func, instruction[1]);
  *returns = 0;
  return code;
}

char * __code_call(char *instruction[], char *current_func, int *returns) {
  int n_args_plus_5 = atoi(instruction[2]) + 5;

  char *code = malloc(sizeof(char) * 600);
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@%s$ret.%d\n\
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
@%d\n\
D=D-A\n\
@ARG\n\
M=D\n\
@%s\n\
0;JMP\n\
(%s$ret.%d)\n\
", current_func, *returns, n_args_plus_5, instruction[1], current_func, *returns);
  (*returns)++;
  return code;
}

char * _code_return() {
  char *code = malloc(sizeof(char) * 400);
  if (code == NULL) { printf("Error allocating memory.\n"); exit(1); }
  sprintf(code,
"\
@5\n\
D=A\n\
@LCL\n\
A=M-D\n\
D=M\n\
@R13\n\
M=D\n\
@SP\n\
A=M-1\n\
D=M\n\
@ARG\n\
A=M\n\
M=D\n\
D=A+1\n\
@SP\n\
M=D\n\
@LCL\n\
AM=M-1\n\
D=M\n\
@THAT\n\
M=D\n\
@LCL\n\
AM=M-1\n\
D=M\n\
@THIS\n\
M=D\n\
@LCL\n\
AM=M-1\n\
D=M\n\
@ARG\n\
M=D\n\
@LCL\n\
AM=M-1\n\
D=M\n\
@LCL\n\
M=D\n\
@R13\n\
A=M\n\
0;JMP\n\
");
  return code;
}
