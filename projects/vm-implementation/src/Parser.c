#include <ctype.h>
#include <string.h>
#include "../include/Parser.h"

void _parse_push_or_pop(char *dest[], char *str);
void _parse_arithmetic(char *dest[], char *str);

void _parse_branching(char *dest[], char *str);
void _parse_func_or_call(char *dest[], char *str);
void _parse_return(char *dest[], char *str);

int rm_comms_spaces(char *str) {
  if (str[0] == '/' || isspace(str[0])) { return 1; }
  str = strsep(&str, "//");
  return 0;
}

void parse(char *dest[], char *str) {
  if ((strncmp(str, "push", 4) == 0) || (strncmp(str, "pop", 3) == 0)) {
    _parse_push_or_pop(dest, str);
  } else if ((strncmp(str, "label", 5) == 0) || (strncmp(str, "goto", 4) == 0) || (strncmp(str, "if-goto", 7) == 0)) {
    _parse_branching(dest, str);
  } else if ((strncmp(str, "function", 8) == 0) || (strncmp(str, "call", 4) == 0)) {
    _parse_func_or_call(dest, str);
  } else if (strncmp(str, "return", 6) == 0) {
    _parse_return(dest, str);
  } else {
    _parse_arithmetic(dest, str);
  }
}

void _parse_push_or_pop(char *dest[], char *str) {
  dest[0] = strsep(&str, " ");
  dest[1] = strsep(&str, " ");
  dest[2] = strsep(&str, " \r\n");
}

void _parse_arithmetic(char *dest[], char *str) {
  dest[0] = "arithmetic";
  dest[1] = strsep(&str, " \r\n");
}

void _parse_branching(char *dest[], char *str) {
  dest[0] = strsep(&str, " ");
  dest[1] = strsep(&str, " \r\n");
}

void _parse_func_or_call(char *dest[], char *str) {
  dest[0] = strsep(&str, " ");
  dest[1] = strsep(&str, " ");
  dest[2] = strsep(&str, " \r\n");
}

void _parse_return(char *dest[], char *str) {
  dest[0] = strsep(&str, " \r\n");
}
