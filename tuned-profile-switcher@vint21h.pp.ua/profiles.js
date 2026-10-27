// gnome-shell-extension-tuned-profile-switcher
// tuned-profile-switcher@vint21h.pp.ua/profiles.js


export const fallbackIconName = "gnome-power-manager-symbolic";


// profile name words with non-trivial spelling
const WORDS = {
    "ac": "AC",
    "aws": "AWS",
    "cpu": "CPU",
    "ece": "ECE",
    "hana": "HANA",
    "hpc": "HPC",
    "kvm": "KVM",
    "mssql": "MS SQL",
    "netweaver": "NetWeaver",
    "openshift": "OpenShift",
    "postgresql": "PostgreSQL",
    "powersave": "Power Save",
    "rhel": "RHEL",
    "sap": "SAP",
    "spectrumscale": "Spectrum Scale",
    "sst": "SST",
};

// profile name words marking performance level, first match wins
const LEVELS = [
    {
        "words": ["powersave", "spindown"],
        "iconName": "power-profile-power-saver-symbolic",
    },
    {
        "words": ["balanced"],
        "iconName": "power-profile-balanced-symbolic",
    },
    {
        "words": ["performance", "throughput", "latency"],
        "iconName": "power-profile-performance-symbolic",
    },
];


/**
 * Format TuneD profile name to be human-readable.
 *
 * @param {String|null} profile. TuneD profile name, e.g. "hpc-compute".
 * @return {String|null}. Formatted profile name, e.g. "HPC Compute".
 */
export function formatProfileName (profile) {
    if (profile === null) {
        return null;
    }
    return profile
        .split(/[-_]/)
        .filter(word => word)
        .map(word => WORDS[word.toLowerCase()] ?? word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}


/**
 * Get icon name of TuneD profile performance level.
 *
 * @param {String|null} profile. TuneD profile name.
 * @return {String|null}. Icon name or null for unknown performance level.
 */
export function profileIconName (profile) {
    if (profile === null) {
        return null;
    }
    let words = profile.toLowerCase().split(/[-_]/);
    for (let level of LEVELS) {
        if (level.words.some(word => words.includes(word))) {
            return level.iconName;
        }
    }
    return null;
}
