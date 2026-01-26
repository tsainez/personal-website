Jekyll::Hooks.register [:documents, :pages], :post_render do |doc|
  next unless doc.output_ext == ".html"

  doc.output.gsub!(/<a\s+(?:[^>]*\s+)?target=(["'])_blank\1[^>]*>/i) do |match|
    # Check if it's already fully secured
    if match.match(/rel=(["'])[^"']*noopener[^"']*\1/) && match.match(/rel=(["'])[^"']*noreferrer[^"']*\1/)
      match
    # Check if it is an external link (http, https, or protocol-relative //)
    elsif match.match(/href=(["'])(?:https?:)?\/\//i)
      if match.include?('rel=')
        match.sub(/rel=(["'])(.*?)\1/) do |m|
           quote = $1
           content = $2
           new_content = content
           new_content += ' noopener' unless new_content.include?('noopener')
           new_content += ' noreferrer' unless new_content.include?('noreferrer')
           "rel=#{quote}#{new_content}#{quote}"
        end
      else
        match.sub('>', ' rel="noopener noreferrer">')
      end
    else
      match
    end
  end
end
