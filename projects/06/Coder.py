import TranslationTables
import SymbolTable


def instruction(instruction):
    if instruction['type'] == 'A':
        return aInstruction(instruction['address'])
    else:
        return cInstruction(instruction)


def aInstruction(address):
    if address.isdigit():
        return '0' + '{0:015b}'.format(int(address)) + '\r\n'
    else:
        if address in SymbolTable.table:
            return '0' + SymbolTable.table[address] + '\r\n'
        else:
            SymbolTable.table[
                address
            ] = '{0:015b}'.format(SymbolTable.nextVariableAddress)
            SymbolTable.nextVariableAddress += 1
            return '0' + SymbolTable.table[address] + '\r\n'


def cInstruction(instruction):
    a = '0'
    dest = TranslationTables.destTable[instruction['dest']]
    comp = instruction['comp']
    if 'M' in comp:
        a = '1'
        comp = comp.replace('M', 'A')
    comp = TranslationTables.compTable[comp]
    jmp = TranslationTables.jmpTable[instruction['jmp']]
    return '111' + a + comp + dest + jmp + '\r\n'
