import { ResponsiveSankey } from '@nivo/sankey'

export const MySankey = ({ data }: { data: any }) => (
    <ResponsiveSankey
        data={data}
        label={node => {
        const totalValue = node.sourceLinks.reduce((acc, l) => acc + l.value, 0)
                         + node.targetLinks.reduce((acc, l) => acc + l.value, 0);
        return totalValue > 0 ? node.id.charAt(0).toUpperCase() + node.id.slice(1) : '';
    }}
        margin={{ top: 40, right: 140, bottom: 20, left: 70 }}
        align="justify"
        colors={{ scheme: 'category10' }}
        nodeOpacity={0.8}
        nodeHoverOthersOpacity={0.35}
        nodeThickness={18}
        nodeSpacing={24}
        nodeBorderWidth={0}
        nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
        nodeBorderRadius={3}
        linkOpacity={0.3}
        linkHoverOthersOpacity={0.1}
        linkContract={2}
        enableLinkGradient={true}
        labelPosition="inside"
        labelOrientation="horizontal"
        labelPadding={16}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
    />
)