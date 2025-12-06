# Personal Website (Jekyll)

This repository contains the source code for my personal website, built using [Jekyll](https://jekyllrb.com), a static site generator. The site is designed to be simple, fast, and easy to maintain.

## Purpose

The main purpose of this project is to provide a personal web presence. It includes a blog, an "About" page, and a home page. The content is written in Markdown and transformed into a static website by Jekyll.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

*   **Ruby**: version 2.5.0 or higher.
*   **RubyGems**: Included with Ruby.
*   **GCC and Make**: For building native extensions.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install Bundler:**
    If you don't have Bundler installed, run:
    ```bash
    gem install bundler
    ```

3.  **Install dependencies:**
    Run the following command to install the required Ruby gems specified in the `Gemfile`:
    ```bash
    bundle install
    ```

## Usage

### Running Locally

To build the site and serve it locally:

```bash
bundle exec jekyll serve
```

This will compile the site and start a local web server at `http://localhost:4000`. The server will watch for changes to your files and automatically rebuild the site.

### Building for Production

To build the site without serving it (e.g., for deployment):

```bash
bundle exec jekyll build
```

The generated site will be placed in the `_site` directory.

## Project Structure

*   **`_config.yml`**: The main configuration file. Contains site settings like title, description, URL, and theme.
*   **`_layouts/`**: Contains HTML templates that wrap content.
    *   `onepager.html`: A custom single-page layout.
*   **`_posts/`**: Contains blog posts written in Markdown. Filenames must follow the format `YYYY-MM-DD-title.md`.
*   **`_sass/`**: Contains SCSS partials, specifically syntax highlighting themes (Dracula, Nord, Monokai, etc.).
*   **`assets/`**: Contains static assets like CSS, images, and JavaScript.
    *   `main.scss`: The main stylesheet that imports the theme and custom styles.
*   **`index.markdown`**: The homepage content.
*   **`about.markdown`**: The "About" page content.
*   **`Gemfile`**: Defines the Ruby gems required by the project.

## Customization

### Configuration
Edit `_config.yml` to update the site title, description, email, and social media links.

### Content
*   To add a new page, create a Markdown file in the root directory.
*   To add a new post, create a Markdown file in `_posts/`.

### Styles
Edit `assets/main.scss` to add custom CSS. You can also modify the syntax highlighting theme by changing the import in `assets/main.scss`.

## License

[Add License Information Here]
