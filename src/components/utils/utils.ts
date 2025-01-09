
// Function to strip HTML tags
export const stripHtml = (html: string): string => {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};
export function stripHtmlTags(html: string): string {
  return html.replace(/<\/?[^>]+(>|$)/g, '').trim();
}


// Function to extract the first image from content and remove it
export const extractAndRemoveImage = (
  content: string
): { imageUrl: string | null; formatedContent: string } => {
  const imgRegex =
    /<figure class="wp-block-image size-large">[\s\S]*?<img[\s\S]*?src="(.*?)"[\s\S]*?<\/figure>/;
  const match = content?.match(imgRegex);
  let imageUrl: string | null = null;
  let formatedContent = content;

  if (match && match[1]) {
    imageUrl = match[1];
    formatedContent = content.replace(match[0], '');
  }

  return { imageUrl, formatedContent };
};

export const formatedBookContent = (
  content: string
): {
  imageUrl: string | null;
  formatedContent: string;
  amazonUrl: string | null;
} => {
  // Regex patterns
  const imgRegex =
    /<figure class="wp-block-image size-full">[\s\S]*?<\/figure>/;
  const amazonLinkRegex =
    /<p><a href="(https:\/\/www\.amazon\.com\/[^"]+)">[^<]+<\/a><\/p>/;
  const srcRegex = /src="([^"]+)"/;

  let imageUrl: string | null = null;
  let amazonUrl: string | null = null;
  let formatedContent = content;

  // Extract and remove the image
  const imageMatch = content?.match(imgRegex);
  if (imageMatch) {
    const srcMatch = imageMatch[0].match(srcRegex);
    if (srcMatch) {
      imageUrl = srcMatch[1];
    }
    formatedContent = content?.replace(imageMatch[0], '');
  }

  // Extract and remove the Amazon link
  const amazonMatch = formatedContent?.match(amazonLinkRegex);
  if (amazonMatch) {
    amazonUrl = amazonMatch[1];
    formatedContent = formatedContent?.replace(amazonMatch[0], '');
  }

  // Clean up any remaining "Click here to get your e-copy" text since it's now empty
  formatedContent = formatedContent?.replace(
    /<p>Click here to get your e-copy or paper copy of<\/p>/,
    ''
  );

  // Clean up any double line breaks that might have been created
  formatedContent = formatedContent?.replace(/\n\s*\n\s*\n/g, '\n\n');

  // Trim any trailing whitespace
  formatedContent = formatedContent?.trim();

  return {
    imageUrl,
    formatedContent,
    amazonUrl,
  };
};

// function to use html entites
export const decodeHtmlEntities = (text: string) => {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
};

// function to extract youtube links
export const extractYouTubeUrl = (content: string): string => {
  const iframeMatch = content.match(/src="([^"]+youtube[^"]+)"/);
  return iframeMatch ? iframeMatch[1] : '';
};

// function to format title to show uppercase
export const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// function to extract Amazon links from HTML elements
export const extractAmazonUrl = (content: string): string => {
  const linkMatch = content.match(
    /href="(https?:\/\/(?:www\.)?amazon\.com\/[^"]+)"/
  );
  return linkMatch ? linkMatch[1] : '';
};

export const extractBottomImageAndLink = (
  content: string
): {
  imageUrl: string | null;
  linkUrl: string | null;
  formatedContent: string;
} => {
  let imageUrl: string | null = null;
  let linkUrl: string | null = null;
  let formatedContent = content;

  // More specific regex for the last figure block
  const lastFigureRegex =
    /(<figure[^>]*>[^<]*<img[^>]*src="([^"]*)"[^>]*>[^<]*<\/figure>)[^<]*$/i;
  const figureMatch = formatedContent.match(lastFigureRegex);

  // More specific regex for the last link
  const lastLinkRegex =
    /(https?:\/\/(?:www\.)?amazon\.com\/[^\s<>"'\n]+)[^\w]*$/i;
  const linkMatch = formatedContent.match(lastLinkRegex);

  // Extract and remove the link first (if it exists)
  if (linkMatch && linkMatch[1]) {
    linkUrl = linkMatch[1];
    formatedContent = formatedContent.replace(linkMatch[1], '').trim();
  }

  // Then extract and remove the image (if it exists)
  if (figureMatch && figureMatch[2]) {
    imageUrl = figureMatch[2];
    formatedContent = formatedContent.replace(figureMatch[1], '').trim();
  }

  return { imageUrl, linkUrl, formatedContent };
};

export const truncateString = (str: string, maxLength: number) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + '...';
  }
  return str;
};


//getDominantColor from image 
export async function getDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const [r, g, b] = calculateAverageColor(imageData.data);
          resolve(`rgb(${r}, ${g}, ${b})`);
        } else {
          reject(new Error('Canvas context not available'));
        }
      } catch (error) {
        reject(error);
      }
    };

    // img.onerror = () => {
    //   reject(new Error('Failed to load image'));
    // };

    img.src = imageUrl;
  });
}

// Helper function to calculate average color
function calculateAverageColor(data: Uint8ClampedArray): [number, number, number] {
  let r = 0, g = 0, b = 0, count = 0;

  for (let i = 0; i < data.length; i += 4) {
    r += data[i];     // Red channel
    g += data[i + 1]; // Green channel
    b += data[i + 2]; // Blue channel
    count++;
  }

  return [Math.floor(r / count), Math.floor(g / count), Math.floor(b / count)];
}
