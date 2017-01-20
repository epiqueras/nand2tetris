import os
import sys
import Parser
import Coder
import SymbolTable

asmFile = sys.argv[1]
with open(asmFile, 'r') as file:
    with open(asmFile.replace('.asm', '.tmphack'), 'w+') as tmpFile:
        for line in file:
            line = Parser.removeSpaceAndComments(line)
            if (line):
                line = SymbolTable.addLabel(line)
                if (line):
                    tmpFile.write(line)
        with open(asmFile.replace('.asm', '.hack'), 'w') as outFile:
            tmpFile.seek(0)
            for line in tmpFile:
                outFile.write(Coder.instruction(Parser.instruction(line)))

os.remove(tmpFile.name)

print 'Program assembled.'
