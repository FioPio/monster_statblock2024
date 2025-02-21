import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import * as yaml from 'js-yaml';

interface StatBlockData {
    name: string;
    creature_type: string;
    alignment: string;
    ac: number;
    speed: string;
    scores: number[];
    saves: string[];
    skills: { [key: string]: number }[];
    gear: string[];
    senses: string;
    languages: string;
    cr: string;
    actions: { name: string; desc: string }[];
    bonus_actions?: { name: string; desc: string }[];
    hp: string;
}

// CR DATA
interface CrData {
    xp: number;
    prof_bonus: number;
}

// Define the primary dictionary with `cr` as the key
type CrDictionary = {
    [cr: string]: CrData;
};

// Example usage:
const crDictionary: CrDictionary = {
    "0": { xp: 10, prof_bonus: 2 },
    "1/8": { xp: 25, prof_bonus: 2 },
    "1/4": { xp: 50, prof_bonus: 2 },
    "1/2": { xp: 100, prof_bonus: 2 },
    "1": { xp: 200, prof_bonus: 2 },
    "2": { xp: 450, prof_bonus: 2 },
    "3": { xp: 700, prof_bonus: 2 },
    "4": { xp: 1100, prof_bonus: 2 },
    "5": { xp: 1800, prof_bonus: 3 },
    "6": { xp: 2300, prof_bonus: 3 },
    "7": { xp: 2900, prof_bonus: 3 },
    "8": { xp: 3900, prof_bonus: 3 },
    "9": { xp: 5000, prof_bonus: 4 },
    "10": { xp: 5900, prof_bonus: 4 },
    "11": { xp: 7200, prof_bonus: 4 },
    "12": { xp: 8400, prof_bonus: 4 },
    "13": { xp: 10000, prof_bonus: 5 },
    "14": { xp: 11500, prof_bonus: 5 },
    "15": { xp: 13000, prof_bonus: 5 },
    "16": { xp: 15000, prof_bonus: 5 },
    "17": { xp: 18000, prof_bonus: 6 },
    "18": { xp: 20000, prof_bonus: 6 },
    "19": { xp: 22000, prof_bonus: 6 },
    "20": { xp: 25000, prof_bonus: 6 },
    "21": { xp: 33000, prof_bonus: 7 },
    "22": { xp: 41000, prof_bonus: 7 },
    "23": { xp: 50000, prof_bonus: 7 },
    "24": { xp: 62000, prof_bonus: 7 },
    "25": { xp: 75000, prof_bonus: 8 },
    "26": { xp: 90000, prof_bonus: 8 },
    "27": { xp: 105000, prof_bonus: 8 },
    "28": { xp: 120000, prof_bonus: 8 },
    "29": { xp: 135000, prof_bonus: 9 },
    "30": { xp: 155000, prof_bonus: 9 },
};

export default class CreatureStatBlockPlugin extends Plugin {


    async onload() {
        console.log("Loading Creature Stat Block Plugin");

        // Register the code block processor
        this.registerMarkdownCodeBlockProcessor("sblock", (source, el, ctx) => {
            this.renderCreatureStatBlock(source, el);
        });

        console.log("MarkdownCodeBlockProcessor registered");
    }


    renderCreatureStatBlock(source: string, el: HTMLElement) {
        try {
            // Parse the YAML content
            const data = this.parseYAML(source);

            // Get the scores and modifiers
            const str_score = data.scores[0] ? data.scores[0] : 10;
            const dex_score = data.scores[1] ? data.scores[1] : 10;
            const con_score = data.scores[2] ? data.scores[2] : 10;
            const int_score = data.scores[3] ? data.scores[3] : 10;
            const wis_score = data.scores[4] ? data.scores[4] : 10;
            const cha_score = data.scores[5] ? data.scores[5] : 10;

            // TODO: ADD LOGIC TO GET THE RIGHT PROFICIENCY BONUS
            var prof_mod = data.cr ? crDictionary[data.cr].prof_bonus : 2;

            const score_modifiers: number[] =
                data.scores ?
                    data.scores.map((num) => Math.trunc((num - 10) / 2)) :
                    [0, 0, 0, 0, 0, 0];

            var saves = [0, 0, 0, 0, 0, 0];
            if (data.saves) {
                if (data.saves.includes("str")) {
                    saves[0] = prof_mod;
                }
                if (data.saves.includes("dex")) {
                    saves[1] = prof_mod;
                }
                if (data.saves.includes("con")) {
                    saves[2] = prof_mod;
                }
                if (data.saves.includes("int")) {
                    saves[3] = prof_mod;
                }
                if (data.saves.includes("wis")) {
                    saves[4] = prof_mod;
                }
                if (data.saves.includes("cha")) {
                    saves[5] = prof_mod;
                }
            }

            // Create the outer container
            const outerContainer = document.createElement("div");
            outerContainer.classList.add("creature-stat-block-outer");

            // Create the inner container
            const innerContainer = document.createElement("div");
            innerContainer.classList.add("creature-stat-block-inner");

            // Add the creature name
            if (data.name) {
                const name = document.createElement("h1");
                name.innerText = data.name;
                innerContainer.appendChild(name);
            }

            // Create the content container (for the two columns)
            const contentContainer = document.createElement("div");
            contentContainer.classList.add("creature-stat-block-content");

            // Left Column (Basic Stats)
            const leftColumn = document.createElement("div");
            leftColumn.classList.add("left-column");
            var textLeftColumn = `<div  class="two-column-layout">`;
            // Data Ceatre and alignment
            if (data.creature_type) {
                textLeftColumn += `<div><span class="creature-type">${data.creature_type}`;
                if (data.alignment) {
                    textLeftColumn += `, ${data.alignment}</span></div>`;
                }
                else {
                    textLeftColumn += `</<span>></div>`;
                }
            }
            else if (data.alignment) {
                textLeftColumn += `<span class="creature-type">${data.alignment}</spawn></div>`;
            }

            {
                var ac = 10;
                var initiative = score_modifiers[1];
                // AC + INITIATIVE
                if (data.ac) {
                    ac = data.ac;
                }
                const symbol_ini = initiative >= 0 ? "+" : "";
                textLeftColumn += `<div class="ac-initiative"><spawn class="black-bold-text">AC </spawn><p>${ac}    </p><spawn class="black-bold-text">Initiative </spawn><p>${symbol_ini}${initiative} (${10 + initiative})</p></div>`;
            }
            if (data.hp) {
                textLeftColumn += `<div class="aligned-div"><spawn class="black-bold-text">HP </spawn><p>${data.hp}</p></div>`;
            }
            if (data.speed) {
                textLeftColumn += `<div class="aligned-div"><spawn class="black-bold-text">Speed </spawn><p>${AddLinks(data.speed)}</p></div>`;
            }
            // Table container
            // Table HTML
            textLeftColumn += `
<div>
    <table class="stats-table">
        <thead>
            <tr>
                <td class="title-th"> </td>
                <td class="title-th"> </td>
                <td class="title-th"><spawn class="black-bold-text">MOD</spawn></td>
                <td class="title-th"><spawn class="black-bold-text">SAVE</spawn></td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="column_1"><spawn class="black-bold-text">STR</spawn></td>
                <td class="column_2">${str_score}</td>
                <td class="column_3">${score_modifiers[0] >= 0 ? "+" : ""}${score_modifiers[0]}</td>
                <td class="column_4">${score_modifiers[0] + saves[0] >= 0 ? "+" : ""}${score_modifiers[0] + saves[0]}</td>
            </tr>
            <tr>
                <td class="column_1"><spawn class="black-bold-text">DEX</spawn></td>
                <td class="column_2">${dex_score}</td>
                <td class="column_3">${score_modifiers[1] >= 0 ? "+" : ""}${score_modifiers[1]}</td>
                <td class="column_4">${score_modifiers[1] + saves[1] >= 0 ? "+" : ""}${score_modifiers[1] + saves[1]}</td>
            </tr>
            <tr>
                <td class="column_1"><spawn class="black-bold-text">CON</spawn></td>
                <td class="column_2">${con_score}</td>
                <td class="column_3">${score_modifiers[2] >= 0 ? "+" : ""}${score_modifiers[2]}</td>
                <td class="column_4">${score_modifiers[2] + saves[2] >= 0 ? "+" : ""}${score_modifiers[2] + saves[2]}</td>
            </tr>
            <tr>
                <td class="column_1"><spawn class="black-bold-text">INT</spawn></td>
                <td class="column_2">${int_score}</td>
                <td class="column_3">${score_modifiers[3] >= 0 ? "+" : ""}${score_modifiers[3]}</td>
                <td class="column_4">${score_modifiers[3] + saves[3] >= 0 ? "+" : ""}${score_modifiers[3] + saves[3]}</td>
            </tr>
            <tr>
                <td class="column_1"><spawn class="black-bold-text">WIS</spawn></td>
                <td class="column_2">${wis_score}</td>
                <td class="column_3">${score_modifiers[4] >= 0 ? "+" : ""}${score_modifiers[4]}</td>
                <td class="column_4">${score_modifiers[4] + saves[4] >= 0 ? "+" : ""}${score_modifiers[4] + saves[4]}</td>
            </tr>
            <tr>
                <td class="column_1"><spawn class="black-bold-text">CHA</spawn></td>
                <td class="column_2">${cha_score}</td>
                <td class="column_3">${score_modifiers[5] >= 0 ? "+" : ""}${score_modifiers[5]}</td>
                <td class="column_4">${score_modifiers[5] + saves[5] >= 0 ? "+" : ""}${score_modifiers[5] + saves[5]}</td>
            </tr>
        </tbody>
    </table>
</div>`;
            // Skills
            if (data.skills) {
                textLeftColumn += `<div class="aligned-div"><spawn class="black-bold-text">Skills </spawn><p>${AddLinks(this.formatSkills(data.skills))}</p></div>`;
            }
            if (data.gear) {
                textLeftColumn += `<div class="aligned-div"><spawn class="black-bold-text">Gear </spawn><p>${AddLinks(this.formatGear(data.gear))}</p></div>`;
            }
            if (data.senses) {
                textLeftColumn += `<div class="aligned-div"><spawn class="black-bold-text">Senses </spawn><p>${AddLinks(data.senses)}</p></div>`;
            }
            if (data.languages) {
                textLeftColumn += `<div class="aligned-div"><spawn class="black-bold-text">Senses </spawn><p>${AddLinks(data.languages)}</p></div>`;
            }
            if (data.cr) {
                textLeftColumn += `<div class="aligned-div"><spawn class="black-bold-text">CR </spawn><p>${data.cr} (${crDictionary[data.cr].xp} XP; PB +${crDictionary[data.cr].prof_bonus})</p></div>`;
            }


            /*/ Right Column (Actions)
            const rightColumn = document.createElement("div");
            rightColumn.classList.add("right-column");
            */

            // Append Actions
            textLeftColumn += "<h4>Actions</h4>";
            data.actions.forEach((action: { name: string; desc: string }) => {
                textLeftColumn += `<p><strong>${AddLinks(action.name)}:</strong> ${AddLinks(action.desc)}</p>`;
            });

            // Append Bonus Actions
            if (data.bonus_actions) {
                textLeftColumn += "<h4>Bonus Actions</h4>";
                data.bonus_actions.forEach((action: { name: string; desc: string }) => {
                    textLeftColumn += `<p><strong>${AddLinks(action.name)}:</strong> ${AddLinks(action.desc)}</p>`;
                });
            }

            textLeftColumn += `</div>`;

            //rightColumn.innerHTML = actionsHTML;
            leftColumn.innerHTML = textLeftColumn;
            // Append columns to the content container
            contentContainer.appendChild(leftColumn);
            //contentContainer.appendChild(rightColumn);

            // Append the content container to the inner container
            innerContainer.appendChild(contentContainer);

            // Append the inner container to the outer container
            outerContainer.appendChild(innerContainer);

            // Replace the original code block with the new layout
            el.replaceWith(outerContainer);

            // Debug: Log the generated HTML
            console.log("Generated HTML:", outerContainer.outerHTML);
        } catch (error) {
            console.error("Error rendering stat block:", error);
        }
    }

    parseYAML(content: string): StatBlockData {
        return yaml.load(content) as StatBlockData;
    }

    formatSkills(skills: { [key: string]: number }[]): string {
        return skills.map((skill: { [key: string]: number }) => `${Object.keys(skill)[0]}: ${Object.values(skill)[0]}`).join(", ");
    }

    formatGear(gear: string[]): string {
        return gear.join(", ");
    }


}


function AddLinks(str_to_test: string) {
    const replaced_text = str_to_test.replace(/\[\[(.*?)\]\]/g, (match, content) => {
        let linkHTML = "";

        if (content.includes("|")) {
            const [link, display] = content.split("|");
            linkHTML = `<a href="${link}" class="internal-link">${display}</a>`;
        } else {
            linkHTML = `<a href="${content}" class="internal-link">${content}</a>`;
        }

        return linkHTML;
    });

    return replaced_text
}


