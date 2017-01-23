IDIR=../include
CC=gcc
CFLAGS=-I$(IDIR)

ODIR=./obj

_DEPS=Parser.h
DEPS=$(patsubst %,$(IDIR)/%,$(_DEPS))

_OBJ=VMTranslator.o Parser.o Coder.o
OBJ=$(patsubst %,$(ODIR)/%,$(_OBJ))


obj/%.o: %.c $(DEPS)
	$(CC) -c -o $@ $< $(CFLAGS)

../VMTranslator: $(OBJ)
	gcc -o $@ $^ $(CFLAGS)

.PHONY: clean

clean:
	rm -f $(ODIR)/*.o *~ core $(INCDIR)/*~ 
