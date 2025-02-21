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
            var prof_mod = 2;

            const score_modifiers: number[] =
                data.scores ?
                    data.scores.map((num) => Math.trunc((num - 10) / 2)) :
                    [0, 0, 0, 0, 0, 0];

            var saves = [0, 0, 0, 0, 0, 0];
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
            var textLeftColumn = "";
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
                textLeftColumn += `<div class="aligned-div"><spawn class="black-bold-text">Speed </spawn><p>${data.speed}</p></div>`;
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

            // Append all the basic stats
            textLeftColumn += `
        <h4>Skills</h4><p>${this.formatSkills(data.skills)}</p>
        <h4>Gear</h4><p>${this.formatGear(data.gear)}</p>
        <h4>Senses</h4><p>${data.senses}</p>
        <h4>Languages</h4><p>${data.languages}</p>
        <h4>CR</h4><p>${data.cr}</p>
      `;

            leftColumn.innerHTML = textLeftColumn;

            // Right Column (Actions)
            const rightColumn = document.createElement("div");
            rightColumn.classList.add("right-column");

            // Append Actions
            let actionsHTML = "<h4>Actions</h4>";
            data.actions.forEach((action: { name: string; desc: string }) => {
                actionsHTML += `<p><strong>${action.name}:</strong> ${action.desc}</p>`;
            });

            // Append Bonus Actions
            if (data.bonus_actions) {
                actionsHTML += "<h4>Bonus Actions</h4>";
                data.bonus_actions.forEach((action: { name: string; desc: string }) => {
                    actionsHTML += `<p><strong>${action.name}:</strong> ${action.desc}</p>`;
                });
            }

            rightColumn.innerHTML = actionsHTML;

            // Append columns to the content container
            contentContainer.appendChild(leftColumn);
            contentContainer.appendChild(rightColumn);

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
