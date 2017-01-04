import sys
import Parser
import Coder
import SymbolTable

asmFile = sys.argv[1]
with open(asmFile, 'r') as file:
    lines = file.readlines()

lines = Parser.removeSpaceAndComments(lines)
lines = SymbolTable.addLabels(lines)

binaryLines = []
for line in lines:
    binaryLines.append(Coder.instruction(Parser.instruction(line)))

with open(asmFile.replace('.asm', '.hack'), 'w') as outFile:
    for line in binaryLines:
        outFile.write(line)

print 'Program assembled.'
