def removeSpaceAndComments(line):
    if line == '' or line.isspace():
        return False
    elif line[0:2] == '//':
        return False
    else:
        if '/' in line:
            return line[0:line.index('/')].replace(' ', '') + '\n'
        else:
            return line.replace(' ', '')


def instruction(line):
    cleanLine = line.replace('\n', '').replace('\r', '')
    if cleanLine[0] == '@':
        return {'type': 'A', 'address': cleanLine[1:]}
    else:
        if '=' in cleanLine:
            splitLine = cleanLine.split('=')
            dest = splitLine[0]
            cleanLine = '-'.join(splitLine[1:])
        else:
            dest = 'none'

        if ';' in cleanLine:
            splitLine = cleanLine.split(';')
            comp = splitLine[0]
            jmp = splitLine[1]
        else:
            comp = cleanLine
            jmp = 'none'
        return {'type': 'C', 'dest': dest, 'comp': comp, 'jmp': jmp}
