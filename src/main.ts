import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import * as yaml from 'js-yaml'; // Import js-yaml

interface StatBlockData {
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

        // Debug: Check if the plugin is loaded
        console.log("Plugin loaded successfully");

        // Register the post-processor to recognize `sblock`
        this.registerMarkdownCodeBlockProcessor("sblock", (source, el, ctx) => {
            console.log("It WORKS!");
            // Get all the code blocksconst values = this.parseSource(source);
            this.renderCreatureStatBlock(el);
        });


        // Debug: Confirm the post-processor is registered
        console.log("MarkdownPostProcessor registered");
    }


    onunload() {
        console.log("Unloading Creature Stat Block Plugin");
    }

    // Function to parse and render the stat block
    renderCreatureStatBlock(block: HTMLElement) {
        try {
            // Remove "sblock" and parse the YAML content
            const yamlContent = block.innerText.replace("sblock", "").trim();
            const data = this.parseYAML(yamlContent);

            // Create the layout
            const container = document.createElement("div");
            container.classList.add("creature-stat-block");

            // Left Column (Basic Stats)
            const leftColumn = document.createElement("div");
            leftColumn.classList.add("left-column");

            // Append all the basic stats
            leftColumn.innerHTML = `
        <h4>Creature Type</h4><p>${data.creature_type}</p>
        <h4>Alignment</h4><p>${data.alignment}</p>
        <h4>AC</h4><p>${data.ac}</p>
        <h4>Speed</h4><p>${data.speed}</p>
        <h4>Scores</h4><p>${data.scores.join(", ")}</p>
        <h4>Skills</h4><p>${this.formatSkills(data.skills)}</p>
        <h4>Gear</h4><p>${this.formatGear(data.gear)}</p>
        <h4>Senses</h4><p>${data.senses}</p>
        <h4>Languages</h4><p>${data.Languages}</p>
        <h4>CR</h4><p>${data.cr}</p>
      `;

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

            // Append columns to container
            container.appendChild(leftColumn);
            container.appendChild(rightColumn);

            // Replace the original code block with the new layout
            block.replaceWith(container);
        } catch (error) {
            console.error("Error rendering stat block:", error);
        }
    }

    // Helper function to parse YAML content
    parseYAML(content: string): StatBlockData {
        return yaml.load(content) as StatBlockData; // Use js-yaml for YAML parsing
    }

    // Helper functions to format skills and gear
    formatSkills(skills: { [key: string]: string }[]): string {
        return skills.map((skill: { [key: string]: string }) => `${Object.keys(skill)[0]}: ${Object.values(skill)[0]}`).join(", ");
    }

    formatGear(gear: string[]): string {
        return gear.join(", ");
    }
}
