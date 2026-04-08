#!/usr/bin/env bash

input="${1:-input.tsv}"
output="${2:-decisions.tsv}"
batch_size=10

: > "$output"

exec 3< "$input"

while :; do
    batch=()

    # read batch
    for ((i=0; i<batch_size; i++)); do
        if IFS= read -r line <&3; then
            batch+=("$line")
        else
            break
        fi
    done

    (( ${#batch[@]} == 0 )) && break

    printf '\n'

    # show numbered + aligned
    for i in "${!batch[@]}"; do
        printf "%2d\t%s\n" "$((i+1))" "${batch[i]}"
    done | column -t -s $'\t'

    # input loop
    while :; do
        read -rp $'\nExclude which rows? (e.g. 1,3-5 | all | none): ' ans

        if [[ "$ans" == "all" || "$ans" == "none" ]]; then
            break
        fi

        # basic validation
        if [[ "$ans" =~ ^[0-9,\-]+$ ]]; then
            break
        else
            echo "Invalid input."
        fi
    done

    # initialize all as kept
    marks=()
    for ((i=0; i<${#batch[@]}; i++)); do
        marks[i]="y"
    done

    if [[ "$ans" == "all" ]]; then
        for ((i=0; i<${#batch[@]}; i++)); do
            marks[i]="n"
        done
    elif [[ "$ans" != "none" ]]; then
        IFS=',' read -ra parts <<< "$ans"

        for part in "${parts[@]}"; do
            if [[ "$part" == *-* ]]; then
                start=${part%-*}
                end=${part#*-}
                for ((i=start; i<=end; i++)); do
                    ((i>=1 && i<=${#batch[@]})) && marks[i-1]="n"
                done
            else
                i=$part
                ((i>=1 && i<=${#batch[@]})) && marks[i-1]="n"
            fi
        done
    fi

    # write output
    for i in "${!batch[@]}"; do
        printf '%s\t%s\n' "${marks[i]}" "${batch[i]}" >> "$output"
    done

done

echo
echo "Done. Output: $output"
