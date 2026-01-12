# frozen_string_literal: true

# 🛡️ Sentinel: External Links Security Plugin
# Automatically adds rel="noopener noreferrer" to external links with target="_blank"
# to prevent reverse tabnabbing attacks.

Jekyll::Hooks.register [:pages, :posts], :post_render do |doc|
  next unless doc.output_ext == ".html"

  doc.output.gsub!(/<a\s+(?:[^>]*?\s+)?target=["']_blank["'](?:[^>]*?)>/i) do |match|
    if match.include?('rel=')
      # If rel exists, append noopener noreferrer if not present
      if match =~ /rel=["'](.*?)["']/
        current_rel = $1
        new_rel = current_rel
        new_rel += " noopener" unless current_rel.include?("noopener")
        new_rel += " noreferrer" unless current_rel.include?("noreferrer")
        match.sub(/rel=["'].*?["']/, "rel=\"#{new_rel}\"")
      else
        match
      end
    else
      # If no rel, add it
      match.sub('>', ' rel="noopener noreferrer">')
    end
  end
end
