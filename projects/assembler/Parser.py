def removeSpaceAndComments(lines):
    newLines = []
    for line in lines:
        if line == '' or line.isspace():
            continue
        elif line[0:2] == '//':
            continue
        else:
            if '/' in line:
                newLines.append(line[0:line.index('/')].replace(' ', ''))
            else:
                newLines.append(line.replace(' ', ''))
    return newLines


def instruction(line):
    cleanLine = line.replace('\r\n', '')
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
