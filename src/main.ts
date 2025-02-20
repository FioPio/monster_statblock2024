import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import * as yaml from 'js-yaml';

interface StatBlockData {
    name: string;
    creature_type: string;
    alignment: string;
    ac: string;
    speed: string;
    scores: string[];
    skills: { [key: string]: string }[];
    gear: string[];
    senses: string;
    Languages: string;
    cr: string;
    actions: { name: string; desc: string }[];
    bonus_actions?: { name: string; desc: string }[];
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
            var text = "";

            if (data.creature_type) {
                text += `<creatureType>${data.creature_type}`;
                if (data.alignment) {
                    text += `, ${data.alignment}</creatureType>`;
                }
                else {
                    text += `</creatureType>`;
                }
            }
            else if (data.alignment) {
                text += `<creatureType>${data.alignment}</creatureType>`;
            }


            // Append all the basic stats
            text += `
        <h4>AC</h4><p>${data.ac}</p>
        <h4>Speed</h4><p>${data.speed}</p>
        <h4>Scores</h4><p>${data.scores.join(", ")}</p>
        <h4>Skills</h4><p>${this.formatSkills(data.skills)}</p>
        <h4>Gear</h4><p>${this.formatGear(data.gear)}</p>
        <h4>Senses</h4><p>${data.senses}</p>
        <h4>Languages</h4><p>${data.Languages}</p>
        <h4>CR</h4><p>${data.cr}</p>
      `;

            leftColumn.innerHTML = text;

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

    formatSkills(skills: { [key: string]: string }[]): string {
        return skills.map((skill: { [key: string]: string }) => `${Object.keys(skill)[0]}: ${Object.values(skill)[0]}`).join(", ");
    }

    formatGear(gear: string[]): string {
        return gear.join(", ");
    }
}
