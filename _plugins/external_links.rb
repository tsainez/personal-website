Jekyll::Hooks.register [:documents, :pages], :post_render do |doc|
  next unless doc.output_ext == ".html"

  doc.output.gsub!(/<a\s+[^>]*>/i) do |match|
    # Check for target="_blank"
    is_blank = match =~ /target=(["'])_blank\1/i

    # Check for external link (http://, https://, or //)
    is_external = match =~ /href=(["'])(?:(?:https?:)?\/\/)/i

    if is_blank && is_external
      if match.include?('rel=')
        # If rel exists, check if it already has noopener noreferrer
        if match.include?('noopener') && match.include?('noreferrer')
          match
        else
          # Append to existing rel attribute
          match.sub(/rel=(["'])(.*?)\1/) do |rel_match|
             quote = $1
             val = $2
             # Append and deduplicate
             new_val = (val.split + ["noopener", "noreferrer"]).uniq.join(' ')
             "rel=#{quote}#{new_val}#{quote}"
          end
        end
      else
        # Add new rel attribute
        match.sub('>', ' rel="noopener noreferrer">')
      end
    else
      match
    end
  end
end
