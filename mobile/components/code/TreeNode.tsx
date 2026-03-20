import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/theme/ThemeContext";
import { fonts, fontWeights } from "@/lib/theme/fonts";
import type { SommaireNode } from "@/lib/data/cgi";

type Props = {
  node: SommaireNode;
  level: number;
  selected: string;
  onSelect: (node: SommaireNode) => void;
  expanded: Record<string, boolean>;
  onToggle: (id: string) => void;
};

function TreeNode({ node, level, selected, onSelect, expanded, onToggle }: Props) {
  const { colors } = useTheme();
  const isAbroge = !!node.abroge;
  const hasChildren = !isAbroge && node.children && node.children.length > 0;
  const isExpanded = expanded[node.id];
  const isSelected = selected === node.id;

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          if (isAbroge) return;
          if (hasChildren) onToggle(node.id);
          onSelect(node);
        }}
        disabled={isAbroge}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 8,
          paddingHorizontal: 8,
          paddingLeft: 8 + level * 16,
          backgroundColor: isSelected && !isAbroge ? colors.primary + "20" : "transparent",
          opacity: isAbroge ? 0.45 : 1,
        }}
        accessibilityLabel={`${node.label}${isAbroge ? ", abrogé" : hasChildren ? ", dossier" : ""}`}
        accessibilityRole="button"
        accessibilityState={{ expanded: hasChildren ? isExpanded : undefined, selected: isSelected }}
      >
        {hasChildren ? (
          <Ionicons
            name={isExpanded ? "chevron-down" : "chevron-forward"}
            size={16}
            color={colors.primary}
            style={{ marginRight: 6 }}
          />
        ) : (
          <View style={{ width: 20 }} />
        )}
        <Text
          style={{
            fontFamily: isSelected && !isAbroge ? fonts.semiBold : fonts.regular,
            fontWeight: isSelected && !isAbroge ? fontWeights.semiBold : fontWeights.regular,
            fontSize: 16,
            flex: 1,
            color: isAbroge ? colors.textMuted : isSelected ? colors.primary : colors.text,
            fontStyle: isAbroge ? "italic" : "normal",
          }}
          numberOfLines={1}
        >
          {node.label}
        </Text>
      </TouchableOpacity>

      {isExpanded && !isAbroge &&
        node.children?.map((child) => (
          <TreeNode
            key={child.id}
            node={child}
            level={level + 1}
            selected={selected}
            onSelect={onSelect}
            expanded={expanded}
            onToggle={onToggle}
          />
        ))}
    </View>
  );
}

export default React.memo(TreeNode);
