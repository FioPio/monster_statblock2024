import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import * as yaml from 'js-yaml';

import { cr_dictionary } from './constants';
import { StatBlockData } from './statblockdata';
import { AddLinks } from './utils';


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
            var prof_mod = data.cr ? cr_dictionary[data.cr].prof_bonus : 2;

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
            const outer_container = document.createElement("div");
            outer_container.classList.add("creature-stat-block-outer");

            // Create the inner container
            const innerer_container = document.createElement("div");
            innerer_container.classList.add("creature-stat-block-inner");

            // Add the creature name
            if (data.name) {
                const name = document.createElement("h1");
                name.innerText = data.name;
                innerer_container.appendChild(name);
            }

            // Create the content container (for the two columns)
            const content_container = document.createElement("div");
            content_container.classList.add("creature-stat-block-content");

            // Left Column (Basic Stats)
            const column_content = document.createElement("div");
            column_content.classList.add("left-column");
            var textColumns = `<div  class="two-column-layout">`;
            // Data Ceatre and alignment
            if (data.creature_type) {
                textColumns += `<div><span class="creature-type">${data.creature_type}`;
                if (data.alignment) {
                    textColumns += `, ${data.alignment}</span></div>`;
                }
                else {
                    textColumns += `</<span>></div>`;
                }
            }
            else if (data.alignment) {
                textColumns += `<span class="creature-type">${data.alignment}</spawn></div>`;
            }

            {
                var ac = 10;
                var initiative = score_modifiers[1];
                // AC + INITIATIVE
                if (data.ac) {
                    ac = data.ac;
                }
                const symbol_ini = initiative >= 0 ? "+" : "";
                textColumns += `<div class="ac-initiative"><spawn class="black-bold-text">AC </spawn><p>${ac}    </p><spawn class="black-bold-text">Initiative </spawn><p>${symbol_ini}${initiative} (${10 + initiative})</p></div>`;
            }
            if (data.hp) {
                textColumns += `<div class="aligned-div"><spawn class="black-bold-text">HP </spawn><p>${data.hp}</p></div>`;
            }
            if (data.speed) {
                textColumns += `<div class="aligned-div"><spawn class="black-bold-text">Speed </spawn><p>${AddLinks(data.speed)}</p></div>`;
            }
            // Table container
            // Table HTML
            textColumns += `
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
                textColumns += `<div class="aligned-div"><spawn class="black-bold-text">Skills </spawn><p>${AddLinks(this.formatSkills(data.skills))}</p></div>`;
            }
            if (data.condition_immunities) {
                textColumns += `<div class="aligned-div"><spawn class="black-bold-text">Condition inmunities </spawn><p>${AddLinks(data.condition_immunities)}</p></div>`;
            }
            if (data.vulnerabilities) {
                textColumns += `<div class="aligned-div"><spawn class="black-bold-text">Damage Vulnerabilities </spawn><p>${AddLinks(data.vulnerabilities)}</p></div>`;
            }
            if (data.resistances) {
                textColumns += `<div class="aligned-div"><spawn class="black-bold-text">Resistances </spawn><p>${AddLinks(data.resistances)}</p></div>`;
            }
            if (data.immunities) {
                textColumns += `<div class="aligned-div"><spawn class="black-bold-text">Condition inmunities </spawn><p>${AddLinks(data.immunities)}</p></div>`;
            }
            if (data.gear) {
                textColumns += `<div class="aligned-div"><spawn class="black-bold-text">Gear </spawn><p>${AddLinks(this.formatGear(data.gear))}</p></div>`;
            }
            if (data.senses) {
                textColumns += `<div class="aligned-div"><spawn class="black-bold-text">Senses </spawn><p>${AddLinks(data.senses)}</p></div>`;
            }
            if (data.languages) {
                textColumns += `<div class="aligned-div"><spawn class="black-bold-text">Languages </spawn><p>${AddLinks(data.languages)}</p></div>`;
            }
            if (data.cr) {
                textColumns += `<div class="aligned-div"><spawn class="black-bold-text">CR </spawn><p>${data.cr} (${cr_dictionary[data.cr].xp} XP; PB +${cr_dictionary[data.cr].prof_bonus})</p></div>`;
            }

            // Append Actions
            if (data.traits) {
                textColumns += "<h4>Traits</h4>";
                data.traits.forEach((trait: { name: string; desc: string }) => {
                    textColumns += `<p><strong>${AddLinks(trait.name)}:</strong> ${AddLinks(trait.desc)}</p>`;
                });
            }

            // Append Actions
            if (data.actions) {
                textColumns += "<h4>Actions</h4>";
                data.actions.forEach((action: { name: string; desc: string }) => {
                    textColumns += `<p><strong>${AddLinks(action.name)}:</strong> ${AddLinks(action.desc)}</p>`;
                });
            }

            // Append Bonus Actions
            if (data.bonus_actions) {
                textColumns += "<h4>Bonus Actions</h4>";
                data.bonus_actions.forEach((action: { name: string; desc: string }) => {
                    textColumns += `<p><strong>${AddLinks(action.name)}:</strong> ${AddLinks(action.desc)}</p>`;
                });
            }

            // Append Reactions
            if (data.reactions) {
                textColumns += "<h4>Reactions</h4>";
                data.reactions.forEach((action: { name: string; desc: string }) => {
                    textColumns += `<p><strong>${AddLinks(action.name)}:</strong> ${AddLinks(action.desc)}</p>`;
                });
            }

            // Append Legendary actions
            if (data.legendary_actions) {
                textColumns += "<h4>Legendary Actions</h4>";
                data.legendary_actions.forEach((action: { name: string; desc: string }) => {
                    textColumns += `<p><strong>${AddLinks(action.name)}:</strong> ${AddLinks(action.desc)}</p>`;
                });
            }


            textColumns += `</div>`;

            column_content.innerHTML = textColumns;
            // Append columns to the content container
            content_container.appendChild(column_content);

            // Append the content container to the inner container
            innerer_container.appendChild(content_container);

            // Append the inner container to the outer container
            outer_container.appendChild(innerer_container);

            // Replace the original code block with the new layout
            el.replaceWith(outer_container);

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

    formatGear(gear: { [key: string]: number }[]): string {
        return gear.map((gear: { [key: string]: number }) => `${Object.keys(gear)[0]}(${Object.values(gear)[0]})`).join(", ");
    }

}
