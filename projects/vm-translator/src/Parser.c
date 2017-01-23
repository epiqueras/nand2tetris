#include <ctype.h>
#include <string.h>
#include "../include/Parser.h"

void _parse_push(char *dest[], char *str);
void _parse_pop(char *dest[], char *str);
void _parse_arithmetic(char *dest[], char *str);

int rm_comms_spaces(char *str) {
  if (str[0] == '/' || isspace(str[0])) { return 1; }
  str = strsep(&str, "//");
  return 0;
}

void parse(char *dest[], char *str) {
  if (strncmp(str, "push", 4) == 0) {
    _parse_push(dest, str);
  } else if (strncmp(str, "pop", 3) == 0) {
    _parse_pop(dest, str);
  } else {
    _parse_arithmetic(dest, str);
  }
}

void _parse_push(char *dest[], char *str) {
  dest[0] = "push";
  strsep(&str, " ");
  dest[1] = strsep(&str, " ");
  dest[2] = strsep(&str, "\n");
}

void _parse_pop(char *dest[], char *str) {
  dest[0] = "pop";
  strsep(&str, " ");
  dest[1] = strsep(&str, " ");
  dest[2] = strsep(&str, "\n");
}

void _parse_arithmetic(char *dest[], char *str) {
  dest[0] = "arithmetic";
  dest[1] = strsep(&str, "\n");
}
