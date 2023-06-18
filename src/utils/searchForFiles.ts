import { readdirSync, lstatSync } from "fs"

export default function searchForFiles(dir: string): string[] {
    const files = readdirSync(dir)
    let cmds: string[] = []
    for (const file of files) {
        const stat = lstatSync(`${dir}/${file}`)
        if (stat.isDirectory()) {
            cmds.push(...searchForFiles(`${dir}/${file}`))
        } else if (file.endsWith(".js")) {
            cmds.push(`${dir}/${file}`)
        }
    }
    return cmds
}