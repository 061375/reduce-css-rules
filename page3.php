<!doctype html>

<html lang="en">
<head>
    <title><!-- Insert your title here --></title>
    
    <link rel="stylesheet" href="<?php echo '_/php/sheets/'.$_SERVER['SERVER_NAME']; ?>/style.css?a=<?php echo strtotime('now'); ?>" />
</head>
<body>
    <h1>
            This Is Page Three
    </h1>
    <p>This is the container for page one</p>
    <div class="container pageone">
        
        <p>
            <-- <a href="page2.php">Go to Page Two</a>
        </p>
        <table>
            <tr>
                <td class="blue">
                    <h2>
                        This is a test
                    </h2>
                </td>
                <td class="yellow">
                    <p>
                        This is a test
                    </p>
                </td>
            </tr>
            <tr>
                <td class="red">
                    <p>
                        <a href="#">This is a test</a>
                    </p>
                </td>
                <td class="green">
                    <p>
                        <a href="#">Green</a>
                    </p>
                </td>
            </tr>
        </table>
    </div>
    <p>This is the container for page two</p>
    <div class="container pagetwo">
        <table>
            <tr>
                <td class="blue">
                    <h2>
                        This is a test
                    </h2>
                </td>
                <td class="yellow">
                    <p>
                        This is a test
                    </p>
                </td>
            </tr>
            <tr>
                <td class="red">
                    <p>
                        <a href="#">This is a test</a>
                    </p>
                </td>
                <td class="purple">
                    <p>
                        <a href="#">Purple</a>
                    </p>
                </td>
            </tr>
        </table>
    </div>
    <div class="statistics">
        <h2>Statistics</h2>
        <?php
            $before = $_SERVER['DOCUMENT_ROOT'].'reduce-css-rules/_/css/style.css';
            $after = $_SERVER['DOCUMENT_ROOT'].'reduce-css-rules/_/php/sheets/'.$_SERVER['SERVER_NAME'].'/style.css';
        ?>
        <h3>Before</h3>
        File size: <?php echo filesize($before); ?> bytes
        <h3>After</h3>
        File size: <?php echo filesize($after); ?> bytes
    </div>
</body>
</html>
