local dumper = require "dumper"
local inspect = require "inspect"
local json = require 'json'

local debug_log = {}

-- print(dumper.DataDumper(df.global.__name ))

local function debug(udt, indent)

    indent = indent or ''

    if type(udt) ~= 'table' and type(udt) ~= 'userdata' then
        print(indent .. udt)
        return
    end

    local tkeys = {}

    for k in pairs(udt) do
        table.insert(tkeys, k)
    end
    table.sort(tkeys)

    for _, k in pairs(tkeys) do
        print(indent .. k, udt[k])
    end
end

local function userdata_to_table(userdata)
    local output = {}

    for k, v in pairs(userdata) do
        if type(v) == 'string' or type(v) == 'boolean' or type(v) == 'number' or type(v) == 'nil' then
            output[k] = v
        else
            output[k] = userdata_to_table(v)
        end
    end

    return output
end

local function getDwarves()
    local dwarves = {}

    for i, unit in pairs(df.global.world.units.active) do
        if dfhack.units.isDwarf(unit) and dfhack.units.isActive(unit) then
            table.insert(dwarves, unit)
        end
    end

    return dwarves
end

local function getBodyModifiers(unit)
    local unitRaws = df.creature_raw.find(unit.race)
    local casteBodyAppearanceModRaws = unitRaws.caste[unit.caste].body_appearance_modifiers

    for i, value in pairs(unit.appearance.body_modifiers) do
        local appearanceModifierName = df.appearance_modifier_type[casteBodyAppearanceModRaws[i].type]

        print('\t', appearanceModifierName .. '=' .. value)
    end
end

local function getBodyPartAppearanceModifiers(unit)
    local unitRaws = df.creature_raw.find(unit.race)
    local casteRaw = unitRaws.caste[unit.caste]
    local casteBodyPartAppearanceRaws = casteRaw.bp_appearance

    -- local raw_json_text = json.encode(userdata_to_table(unit))

    -- print(raw_json_text)

    -- print(inspect(userdata_to_table(casteBodyPartAppearanceRaws)))

    local unit_info = {
        name = dfhack.df2utf(dfhack.TranslateName(dfhack.units.getVisibleName(unit))),
        sex = casteRaw.caste_id,
        bp_modifier_info = {}
    }

    for i, v in pairs(casteBodyPartAppearanceRaws.modifier_idx) do

        local bp_modifier_info = {}

        bp_modifier_info.value = unit.appearance.bp_modifiers[i]

        local part_idx = casteBodyPartAppearanceRaws.part_idx[i]

        local body_part = casteRaw.body_info.body_parts[part_idx]
        bp_modifier_info.body_part_name = body_part.name_singular[0][0]

        local modifier = casteBodyPartAppearanceRaws.modifiers[v]

        bp_modifier_info.appearance_modifier_type = df.appearance_modifier_type[modifier.type]

        local layer_idx = casteBodyPartAppearanceRaws.layer_idx[i]

        if layer_idx > -1 then
            bp_modifier_info.layer_name = body_part.layers[layer_idx].layer_name

            -- debug(casteBodyPartAppearanceRaws.style_part_idx)

            local style_part_idx = casteBodyPartAppearanceRaws.style_part_idx[layer_idx]

            -- Should be the same as body_part, I think?
            -- local style_part = casteRaw.body_info.body_parts[style_part_idx]

            local style_layer_idx = casteBodyPartAppearanceRaws.style_layer_idx[layer_idx]

            local style_layer = body_part.layers[style_layer_idx]

            bp_modifier_info.style_layer_tissue_name = unitRaws.tissue[style_layer.tissue_id].tissue_name_singular

            local style_list_idx = casteBodyPartAppearanceRaws.style_list_idx[style_layer_idx]

        end

        table.insert(unit_info.bp_modifier_info, bp_modifier_info)

        -- print(inspect(unit_info))

    end

    -- debug(unit.appearance.bp_modifiers)

    -- for i, value in pairs(unit.appearance.body_modifiers) do
    --     local appearanceModifierName = df.appearance_modifier_type[casteBodyAppearanceModRaws[i].type]

    --     print('\t', appearanceModifierName .. '=' .. value)
    -- end

    local raw_json_text = json.encode(userdata_to_table(unit_info))

    print(raw_json_text)

end

local dwarves = getDwarves()

local function debugDeep(thing)
    local raw_json_text = json.encode(userdata_to_table(thing))

    print(raw_json_text)

end

-- getBodyModifiers(dwarves[1])
-- getBodyPartAppearanceModifiers(dwarves[6])
-- debug(dwarves[1]:_field('caste').ref_target)

local function getRelationships(dwarf)
    local dwarf_hf = df.global.world.history.figures[dwarf.hist_figure_id]

    local dwarf_info = {
        id = dwarf.hist_figure_id,
        name = dfhack.df2utf(dfhack.TranslateName(dwarf.name)),
        family_head_id = dwarf_hf.family_head_id
    }

    if dwarf_hf.family_head_id > -1 then
        dwarf_info.family_head_name = dfhack.df2utf(dfhack.TranslateName(
            df.global.world.history.figures[dwarf_hf.family_head_id].name))
    end

    -- Add all non-link relationships
    -- if dwarf_hf.info.relationships then
    --     local all_relationships = {}
    --     for _, relationship in ipairs(dwarf_hf.info.relationships.hf_visual) do
    --         local relationship_data = {}

    --         local rel_target = df.global.world.history.figures[relationship.histfig_id]

    --         relationship_data.name = dfhack.df2utf(dfhack.TranslateName(rel_target.name))
    --         relationship_data.race = df.creature_raw.find(rel_target.race).name[0]
    --         relationship_data.love = relationship.love
    --         relationship_data.familiarity = relationship.familiarity
    --         relationship_data.id = relationship.histfig_id
    --         -- relationshipData.relationship = relationship

    --         table.insert(all_relationships, relationship_data)
    --     end
    --     -- dwarf_info.relationships = all_relationships
    -- end

    -- Add link relationships
    local all_hf_links = {}
    for _, hf_link in ipairs(dwarf_hf.histfig_links) do
        local hf_link_data = {}

        hf_link_data.id = hf_link.target_hf
        hf_link_data.type = df.histfig_hf_link_type[hf_link:getType()];
        hf_link_data.name = dfhack.df2utf(dfhack.TranslateName(df.global.world.history.figures[hf_link.target_hf].name))
        hf_link_data.strength = hf_link.link_strength

        -- Getting link type
        -- debug(df.global.world.history.figures[dwarves[10].hist_figure_id].histfig_links[2]:getType())

        table.insert(all_hf_links, hf_link_data)
    end
    dwarf_info.all_hf_links = all_hf_links

    return dwarf_info

end

local fort_relationships = {}

for _, d in ipairs(dwarves) do
    table.insert(fort_relationships, getRelationships(d))
end

debugDeep({
    data = fort_relationships
})

-- TODO: Use family_head_id to create genealogies and mass surname renaming
