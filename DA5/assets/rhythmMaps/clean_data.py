with open("labelTrack1.txt", "r") as raw_data:
    with open ("rhythmMap.txt", "w") as out:
        for line in raw_data:
            str = line.split()
            out.write(str[0] + '\n')