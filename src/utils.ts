


export function AddLinks(str_to_test: string) {
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