import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expanded[node.id];
  const isSelected = selected === node.id;

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          if (hasChildren) onToggle(node.id);
          onSelect(node);
        }}
        className={`flex-row items-center py-2 px-2 ${isSelected ? "bg-primary-light" : ""}`}
        style={{ paddingLeft: 8 + level * 16 }}
        accessibilityLabel={`${node.label}${hasChildren ? ", dossier" : ""}`}
        accessibilityRole="button"
        accessibilityState={{ expanded: hasChildren ? isExpanded : undefined, selected: isSelected }}
      >
        {hasChildren ? (
          <Ionicons
            name={isExpanded ? "chevron-down" : "chevron-forward"}
            size={14}
            color="#00815d"
            style={{ marginRight: 6 }}
          />
        ) : (
          <View style={{ width: 20 }} />
        )}
        <Text
          className={`text-xs flex-1 ${isSelected ? "text-primary font-bold" : "text-text"}`}
          numberOfLines={2}
        >
          {node.label}
        </Text>
      </TouchableOpacity>

      {isExpanded &&
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
